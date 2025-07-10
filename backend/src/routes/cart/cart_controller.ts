import { error, success } from "../../utils/apiReponse";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code";
import { log } from "../../utils/logger";
import { fetchProduct } from "../product/product_controller";
import { fetchProductService } from "../product/product_service";
import {
  addItemToCartService,
  createCartService,
  fetchCartService,
  fetchExistingItemService,
} from "./cart_service";

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
    const { qte, productId } = req.body;
    const userId = req.session?.userId;
    const quantity = Number(qte);

    if (!userId || !productId || !qte) {
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Missing required parameters",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: ["userId, productId and qte are required"] },
      });
    }

    console.log("Adding item to cart", {
      userId: req.session?.userId,
      productId,
      quantity: quantity,
      ip: req.ip,
    });

    const product = await fetchProductService(productId);

    if (!product) {
      log.warn("Product not found", { productId });
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "Product not found",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["Product not found"] },
      });
    }

    log.info("Adding item to cart", {
      userId: userId,
      ip: req.ip,
    });

    const cart = await createCartService(userId);

    const existingItem = await fetchExistingItemService(productId, cart.id);
    const exist = !!existingItem;

    const currentQuantity = existingItem?.quantity ?? 0;
    const totalRequested = currentQuantity + Number(qte);

    if (totalRequested > product.stock || product.stock <= 0) {
      log.warn("Insufficient stock for product", {
        productId: product.id,
        requestedQuantity: quantity,
        availableStock: product.stock,
      });
      return error(res, {
        status: HTTP_STATUS_CODES.BadRequest,
        message: "Insufficient stock for product",
        code: HTTP_STATUS_CODES.BadRequest,
        errors: { general: ["Insufficient stock for product"] },
      });
    }

    const cartItem = await addItemToCartService(
      product,
      cart.id,
      Number(qte),
      exist
    );

    log.info("Item added to cart", {
      userId,
      productId: product.id,
      quantity: qte,
      cartId: cart.id,
    });

    return success(res, cartItem, "Item added to cart");
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
