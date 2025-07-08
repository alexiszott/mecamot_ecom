import { error, success } from "../../utils/apiReponse";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code";
import { log } from "../../utils/logger";
import { fetchProduct } from "../product/product_controller";
import { fetchProductService } from "../product/product_service";
import { createCartService, fetchCartService } from "./cart_service";

export const fetchCart = async (req, res, next) => {
  try {
    log.info("Fetching cart items", {
      userId: req.session?.userId,
      ip: req.ip,
    });

    const cart = await fetchCartService(req.session?.userId);

    if (!cart) {
      log.warn("Cart not found for user, creating one", {
        userId: req.session?.userId,
      });

      const cartCreated = await createCartService(req.session?.userId);
      return success(res, cartCreated, "Cart items fetched successfully");
    }

    return success(res, cart, "Cart items fetched successfully");
  } catch (err: any) {
    log.error("Error fetching cart items", {
      error: err.message,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Error fetching cart items",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Internal server error"] },
    });
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const { productId } = req.query;
    const { qte } = req.params;

    const product = await fetchProductService(productId);

    if (product && product?.stock - qte < 0) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Insufficient stock",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: ["Insufficient stock for this product"] },
      });
    }

    log.info("Adding item to cart", {
      userId: req.session?.userId,
      ip: req.ip,
    });

    return success(res, "TODO");
  } catch (err: any) {
    log.error("Error adding item to cart", {
      error: err.message,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Error adding item to cart",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Internal server error"] },
    });
  }
};

export const removeItemFromCart = async (req, res, next) => {
  try {
    log.info("Removing item from cart", {
      userId: req.session?.userId,
      ip: req.ip,
    });

    const cart = await fetchCartService(req.session?.userId);
    return success(res, cart, "Cart item removed successfully");
  } catch (err: any) {
    log.error("Error removing item from cart", {
      error: err.message,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Error removing item from cart",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Internal server error"] },
    });
  }
};
