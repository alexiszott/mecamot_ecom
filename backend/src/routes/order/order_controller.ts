// ✅ backend/src/routes/product/product_controller.ts
import {
  fetchOrdersService,
  fetchOrderService,
  createOrderService,
  updateOrderService,
  linkReservationsToOrderService,
  createOrderItemsService,
  validateStockBatchService,
  cancelOrderService,
} from "./order_service.js";
import { success, error } from "../../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";
import { log } from "../../utils/logger.js";
import {
  fetchAvailableStockService,
  updateStockProductService,
} from "../product/product_service.js";
import { prisma } from "../../prismaClient.js";
import { OrderInfo } from "../../utils/orderInfo_type.js";
import { PaymentStatus } from "@prisma/client";

export const fetchOrders = async (req, res, next) => {
  try {
    const result = await fetchOrdersService(req.query);

    return success(res, result, "Commandes récupérés avec succès");
  } catch (err: any) {
    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération des commandes",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const fetchOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await fetchOrderService(id);

    if (!order) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "Commande non trouvé",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["La commande demandé n'existe pas"] },
      });
    }

    return success(res, { order }, "Commande récupéré avec succès");
  } catch (err: any) {
    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await updateOrderService(id, req.body);

    return success(res, { order }, "Commande mise à jour avec succès");
  } catch (err: any) {
    error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la mise à jour de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const updateStripeIdOrder = async (
  orderId: string,
  stripeSessionId: string
) => {
  try {
    return await updateOrderService(orderId, { stripeSessionId });
  } catch (err: any) {
    console.error("Erreur updateStripeIdOrder:", err);
    throw new Error("Impossible de mettre à jour la commande");
  }
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentIntentId: string,
  paymentMethodId: string
) => {
  try {
    await updateOrderService(orderId, {
      paymentIntentId,
      paymentMethodId,
      status: "PREPARING",
      paymentStatus: "PAID",
    });
  } catch (err: any) {
    throw new Error(`Erreur lors de la mise à jour du stock : ${err.message}`);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await cancelOrderService(id, req.body);

    return success(res, { order }, "Commande annulée avec succès");
  } catch (err: any) {
    error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de l'annulation de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const createOrder = async (userId: string, orderInfo: OrderInfo) => {
  try {
    const {
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      recipientName,
      cartItems,
      deliveryMethod,
      notes,
    } = orderInfo;

    console.log("Creating order with data:", {
      userId,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      recipientName,
      cartItems,
      deliveryMethod,
      notes,
    });

    let orderId = null;
    let orderResult = null;

    await prisma.$transaction(async (manager) => {
      // 1. Récupérer les produits avec leurs prix actuels et vérifier existence
      const validatedProducts = await fetchAndValidateProducts(
        cartItems,
        manager
      );

      // 2. Vérifier et réserver le stock
      await validateAndReserveStock(validatedProducts, userId, manager);

      // 3. Calculer les prix avec les données fraîches de la base
      const pricing = await calculatePricing(validatedProducts, deliveryMethod);

      // 4. Traitement du paiement (à implémenter)
      // const paymentResult = await processPayment(pricing);
      // if (!paymentResult.success) throw new Error("Paiement échoué");

      // 5. Créer la commande avec toutes les données
      const orderData = {
        subTotal: pricing.subtotal,
        shippingPrice: pricing.shippingPrice,
        totalPrice: pricing.totalPrice,
        taxPrice: pricing.taxPrice,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        shippingPhone,
        recipientName,
        deliveryMethod,
        notes,
        totalWeight: pricing.totalWeight,
      };

      orderResult = await createOrderService(userId, orderData, manager);

      if (!orderResult || !(orderResult as any).id) {
        throw new Error("Erreur lors de la création de la commande");
      }

      orderId = (orderResult as any).id;

      // 6. Lier les réservations à la commande
      await linkReservationsToOrderService(orderId!, userId, manager);

      // 7. Créer les OrderItems avec les vrais prix
      await createOrderItems(validatedProducts, orderId!, userId, manager);
    });

    return success(
      res,
      { order: orderResult, orderId },
      "Commande créée avec succès"
    );
  } catch (err: any) {
    log.error("Erreur lors de la création de la commande", {
      error: err.message,
      userId: req.session?.userId,
      cartItems: req.body.cartItems,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: err.message || "Erreur lors de la création de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: [err.message || "Erreur interne du serveur"] },
    });
  }
};

export const fetchAndValidateProducts = async (
  cartItems: any[],
  prismaManager
) => {
  try {
    const productIds = cartItems.map((item) => item.productId);

    const products = await prismaManager.product.findMany({
      where: {
        id: { in: productIds },
        isDeleted: false,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        weight: true,
      },
    });

    console.log("\n\n\n\nFetched products:", products);

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      throw new Error(`Produits introuvables : ${missingIds.join(", ")}`);
    }

    const validatedProducts = cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) {
        throw new Error(`Produit ${cartItem.productId} introuvable`);
      }

      return {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
        weight: product.weight || 0,
        quantity: cartItem.quantity,
      };
    });

    return validatedProducts;
  } catch (err: any) {
    throw new Error(
      `Erreur lors de la validation des produits : ${err.message}`
    );
  }
};

// Local functions

const calculatePricing = async (
  validatedProducts: any[],
  deliveryMethod?: string
) => {
  try {
    let subtotal = 0;
    let totalWeight = 0;
    let shippingPrice = 5; // Valeur par défaut

    for (const product of validatedProducts) {
      subtotal += product.price * product.quantity;
      totalWeight += (product.weight || 0) * product.quantity;
    }

    const taxPrice = subtotal * 0.2;

    // Calculer les frais de port selon le poids et la méthode
    //if (deliveryMethod === "EXPRESS") {
    //  shippingPrice = totalWeight > 5 ? 15 : 10;
    //} else if (deliveryMethod === "PICKUP") {
    //  shippingPrice = 0;
    //} else {
    //  shippingPrice = totalWeight > 5 ? 8 : 5;
    //}

    const totalPrice = subtotal + taxPrice + shippingPrice;

    return {
      subtotal,
      taxPrice,
      shippingPrice,
      totalPrice,
      totalWeight,
    };
  } catch (err: any) {
    throw new Error(`Erreur lors du calcul des prix : ${err.message}`);
  }
};

const validateAndReserveStock = async (
  validatedProducts: any[],
  userId: string,
  prismaManager
) => {
  try {
    // Vérifier le stock disponible pour chaque produit
    for (const product of validatedProducts) {
      // Récupérer les réservations actives pour ce produit
      const lockedStock = await prismaManager.stockReservation.aggregate({
        where: {
          productId: product.productId,
          status: "ACTIVE",
          expiresAt: { gte: new Date() },
        },
        _sum: { quantity: true },
      });

      const reservedQuantity = lockedStock._sum.quantity || 0;
      const availableStock = product.stock - reservedQuantity;

      if (product.quantity > availableStock) {
        throw new Error(
          `Stock insuffisant pour ${product.name}. Disponible: ${availableStock}, demandé: ${product.quantity}`
        );
      }

      // Créer la réservation
      await prismaManager.stockReservation.create({
        data: {
          userId,
          productId: product.productId,
          quantity: product.quantity,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          status: "ACTIVE",
        },
      });
    }
  } catch (err: any) {
    throw new Error(`Erreur lors de la réservation du stock : ${err.message}`);
  }
};

const createOrderItems = async (
  validatedProducts: any[],
  orderId: string,
  userId: string,
  prismaManager
) => {
  try {
    for (const product of validatedProducts) {
      await createOrderItemsService(
        orderId,
        userId,
        {
          id: product.productId,
          quantity: product.quantity,
          price: product.price,
          weight: product.weight,
        },
        prismaManager
      );
    }
  } catch (err: any) {
    throw new Error(`Erreur lors de la création des items : ${err.message}`);
  }
};

const updateProductStock = async (validatedProducts: any[], prismaManager) => {
  try {
    for (const product of validatedProducts) {
      await updateStockProductService(
        {
          productId: product.productId,
          quantity: product.quantity,
        },
        prismaManager
      );
    }
  } catch (err: any) {
    throw new Error(`Erreur lors de la mise à jour du stock : ${err.message}`);
  }
};
