// ✅ backend/src/routes/product/product_controller.ts
import {
  fetchOrdersService,
  fetchOrderService,
  createOrderService,
  updateOrderService,
  archiveOrderService,
} from "./order_service.js";
import { success, error } from "../../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";
import { log } from "../../utils/logger.js";

export const fetchOrders = async (req, res, next) => {
  try {
    log.info("Récupération des commandes", {
      query: req.query,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const result = await fetchOrdersService(req.query);

    log.info("Commandes récupérés avec succès", {
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      userId: req.session?.userId,
    });

    return success(res, result, "Commandes récupérés avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération des commandes", {
      error: err.message,
      query: req.query,
      userId: req.session?.userId,
    });

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

    log.info("Récupération d'une commande", {
      orderId: id,
      userId: req.session?.userId,
      ip: req.ip,
    });

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
    log.error("Erreur lors de la récupération de la commande", {
      error: err.message,
      productId: req.params.id,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const createOrder = async (req, res, next) => {
  try {
    log.userAction("create_an_order", req.user?.id, {
      orderData: req.body,
      ip: req.ip,
    });

    /* 
    // 1. Vérifier le stock disponible (stock - réservations actives)
    const availableStock = await getAvailableStock(productId);
    if (availableStock < quantity) {
      throw new Error(`Stock insuffisant pour ${productName}`);
    }

    // 2. Créer la réservation (statut ACTIVE)
    const reservation = await createReservation({
      userId, productId, quantity,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // 3. Créer la commande (statut PROCESSING)
    const order = await createOrder({
      status: 'PROCESSING',
      paymentStatus: 'PENDING'
    });

    // 4. Lier réservation à commande
    await linkReservationToOrder(reservation.id, order.id);

    // 5. Si paiement réussi :
    await updateOrder(order.id, { 
      status: 'CONFIRMED', 
      paymentStatus: 'COMPLETED' 
    });
    await updateReservation(reservation.id, { status: 'CONFIRMED' });
    await decreaseStock(productId, quantity);

    // 6. Si paiement échoue :
    await updateOrder(order.id, { 
      status: 'FAILED', 
      paymentStatus: 'FAILED' 
    });
    await updateReservation(reservation.id, { status: 'EXPIRED' });
    */
    
  } catch (err: any) {
    log.error("Erreur lors de la création de la commande", {
      error: err.message,
      productData: req.body,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la création de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("update_order", req.user?.id, {
      productId: id,
      updateData: req.body,
      ip: req.ip,
    });

    const order = await updateOrderService(id, req.body);

    return success(res, { order }, "Commande mise à jour avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la mise à jour de la commande", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la mise à jour de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

// Function to archive 1 product

export const archiveOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("delete_order", req.user?.id, {
      orderId: id,
      ip: req.ip,
    });

    await archiveOrderService(id);

    log.info("Commande supprimé avec succès", {
      productId: id,
      adminId: req.user?.id,
    });

    return success(res, null, "Commande supprimé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression de la commande", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la suppression de la commande",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};
