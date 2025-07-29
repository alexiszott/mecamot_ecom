import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code";
import { error, success } from "../../utils/apiReponse";
import { fetchAndValidateProducts } from "../order/order_controller";
import { prisma } from "../../prismaClient.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
});

const itemsToJsonData = (items: any[]): any[] => {
  const stripeItems: any[] = [];

  console.log("Converting items to Stripe JSON data:", items);

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

export const payment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Veuillez ajouter des produits à votre panier",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: "Panier vide ou invalide" },
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
      }/frontoffice/checkout/shipping`,

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
      },
    };

    if (shippingAddress?.billing?.email) {
      sessionConfig.customer_email = shippingAddress.billing.email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("Session ID:", session.id);
    console.log("Session URL:", session.url);

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
export const sessionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
