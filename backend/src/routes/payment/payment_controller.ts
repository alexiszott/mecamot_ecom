import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code";
import { error, success } from "../../utils/apiReponse";
import {
  fetchAndValidateProducts,
  updateStripeIdOrder,
  updatePaymentStatus,
} from "../order/order_controller";
import { prisma } from "../../prismaClient.js";
import { createOrder } from "../order/order_controller";

const getEndpoint = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not defined in environment variables"
    );
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
};

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not defined in environment variables"
    );
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
};

const itemsToJsonData = (items: any[]): any[] => {
  const stripeItems: any[] = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Items array is required and must not be empty");
  }

  for (const item of items) {
    if (!item.name || !item.productId || !item.price || !item.quantity) {
      throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
    }

    if (typeof item.price !== "number" || item.price <= 0) {
      throw new Error(`Invalid price for item ${item.name}: ${item.price}`);
    }

    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      throw new Error(
        `Invalid quantity for item ${item.name}: ${item.quantity}`
      );
    }

    stripeItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.description,
          metadata: {
            product_id: item.productId,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    });
  }

  return stripeItems;
};

export const payment = async (req, res, next) => {
  try {
    const stripe = getStripe();

    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Veuillez ajouter des produits à votre panier",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: "Panier vide ou invalide" },
      });
    }

    // Create order

    const { userId } = req.session;
    if (!userId) {
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Utilisateur non authentifié",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { general: "Veuillez vous connecter pour passer une commande" },
      });
    }

    const orderInfo = {
      shippingAddress: shippingAddress.shippingAddress,
      shippingCity: shippingAddress.shippingCity,
      shippingPostalCode: shippingAddress.shippingPostalCode,
      shippingCountry: shippingAddress.shippingCountry,
      shippingPhone: shippingAddress.shippingPhone,
      recipientName: shippingAddress.recipientName,
      cartItems: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      deliveryMethod: shippingAddress.deliveryMethod,
      notes: shippingAddress.notes,
    };

    const orderResult = await createOrder(userId, orderInfo);

    if (!orderResult || !orderResult.id) {
      return error(res, {
        status: HTTP_STATUS_CODES.InternalServerError,
        message: "Erreur lors de la création de la commande",
        code: HTTP_STATUS_CODES.InternalServerError,
        errors: { general: "Erreur interne du serveur" },
      });
    }

    const validatedProducts = await fetchAndValidateProducts(items, prisma);

    const stripeLineItems = itemsToJsonData(validatedProducts);

    const sessionConfig: any = {
      mode: "payment",
      line_items: stripeLineItems,
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/frontoffice/checkout/cancel?id=${orderResult.id}`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500, // 5€
              currency: "eur",
            },
            display_name: "Livraison standard",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1000, // 10€
              currency: "eur",
            },
            display_name: "Livraison express",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],
      metadata: {
        order_source: "website",
        customer_notes: shippingAddress?.notes || "",
        order_id: orderResult.id,
      },
    };

    if (shippingAddress?.billing?.email) {
      sessionConfig.customer_email = shippingAddress.billing.email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Update order with Stripe session ID

    const updatedOrder = await updateStripeIdOrder(orderResult.id, session.id);

    if (!updatedOrder) {
      return error(res, {
        status: HTTP_STATUS_CODES.InternalServerError,
        message:
          "Erreur lors de la mise à jour de la commande avec l'ID Stripe",
        code: HTTP_STATUS_CODES.InternalServerError,
        errors: { general: "Erreur interne du serveur" },
      });
    }

    return success(res, {
      status: HTTP_STATUS_CODES.OK,
      message: "Session de paiement créée avec succès",
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        clientSecret: session.client_secret,
      },
    });
  } catch (err: any) {
    console.error("Erreur Stripe Payment :", err);

    if (err.message.includes("Invalid item structure")) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Un ou plusieurs produits dans votre panier sont invalides",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: "Données du panier invalides" },
      });
    }

    if (err.message.includes("Items array is required")) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Panier vide",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: "Panier vide" },
      });
    }

    res.status(500).json({
      error: "Erreur lors de la création de la session Stripe",
      message: "Une erreur technique s'est produite. Veuillez réessayer.",
    });
  }
};

// Récupération du statut de la session
export const sessionStatus = async (req, res, next) => {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id as string
    );

    res.status(200).json({
      status: session.status,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (err: any) {
    console.error("Erreur Stripe Session Status :", err);
    res.status(500).json({
      error: "Erreur lors de la récupération du statut Stripe",
      message: "Impossible de récupérer le statut de la session",
    });
  }
};

// Création d'une session pour le mode embedded
export const createEmbeddedSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Stripe Embedded Payment Request Body:", req.body);

  try {
    const stripe = getStripe();
    const { items: cartItems, shippingAddress } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        error: "Panier vide ou invalide",
        message: "Veuillez ajouter des produits à votre panier",
      });
    }

    const stripeLineItems = itemsToJsonData(cartItems);

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded", // Mode embedded
      mode: "payment",
      line_items: stripeLineItems,
      return_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/return?session_id={CHECKOUT_SESSION_ID}`,

      // Collecte des informations de livraison
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "ES", "IT"],
      },

      // Options de livraison
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500,
              currency: "eur",
            },
            display_name: "Livraison standard",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
      ],

      metadata: {
        order_source: "website_embedded",
        customer_notes: shippingAddress?.notes || "",
      },
    });

    console.log("Embedded Session ID:", session.id);
    console.log("Embedded Session Client Secret:", session.client_secret);

    res.status(200).json({
      clientSecret: session.client_secret,
    });
  } catch (err: any) {
    console.error("Erreur Stripe Embedded Payment :", err);

    if (err.message.includes("Invalid item structure")) {
      return res.status(400).json({
        error: "Données du panier invalides",
        message: "Un ou plusieurs produits dans votre panier sont invalides",
        details: err.message,
      });
    }

    res.status(500).json({
      error: "Erreur lors de la création de la session Stripe embedded",
      message: "Une erreur technique s'est produite. Veuillez réessayer.",
    });
  }
};

export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = req.headers["stripe-signature"];
  const stripeEndpoint = getEndpoint();
  const stripe = getStripe();

  let event;

  if (!sig) {
    return error(res, {
      status: HTTP_STATUS_CODES.BadRequest,
      message: "Webhook signature manquante",
      code: HTTP_STATUS_CODES.BadRequest,
      errors: { general: "Signature de webhook manquante" },
    });
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeEndpoint);
  } catch (err) {
    return error(res, {
      status: HTTP_STATUS_CODES.BadRequest,
      message: "Webhook signature verification failed",
      code: HTTP_STATUS_CODES.BadRequest,
      errors: { general: "Signature de webhook invalide" },
    });
  }

  console.log("Received Stripe event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.order_id;
    const paymentIntentId = session.payment_intent as string;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentMethodId = paymentIntent.payment_method as string;

    console.log("\n\n\n\n\n");
    console.log("Payment Intent ID:", paymentIntentId);
    console.log("Payment Method ID:", paymentMethodId);
    console.log("Order ID from metadata:", orderId);

    if (!orderId) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Order ID manquant dans metadata.",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: "Order ID manquant dans metadata." },
      });
    }

    try {
      await updatePaymentStatus(orderId, paymentIntentId, paymentMethodId);

      // 👇 Tu peux aussi appliquer ici la réservation de stock

      //TODO

      console.log("Commande confirmée :", orderId);
      return success(res, { orderId });
    } catch (err) {
      console.error("Erreur update commande après paiement :", err);
      return error(res, {
        status: HTTP_STATUS_CODES.InternalServerError,
        message: "Erreur serveur",
        code: HTTP_STATUS_CODES.InternalServerError,
        errors: { general: "Erreur lors de la mise à jour de la commande" },
      });
    }
  } else {
    // Si tu veux gérer d'autres événements plus tard
    console.log(`Unhandled event type ${event.type}`);
    res.status(200).json({ received: true });
  }
};
