import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "./product_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  validateQuery,
  validateParams,
} from "../../middleware/query_validation.js";
import {
  productQuerySchema,
  productParamsSchema,
} from "../../utils/validate_schema.js";

const router = Router();

// Public routes
router.get("/", validateQuery(productQuerySchema), fetchProducts);
router.get("/:slug", validateQuery(productQuerySchema), fetchProduct);

// Protected routes

router.post(
  "/",
  requireAuth,
  requireAdmin /*validateBody(productParamsSchema),*/,
  addProduct
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(productParamsSchema),
  // validateBody(productParamsSchema), // Assuming you have a schema for the body
  updateProduct
);
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(productParamsSchema),
  deleteProduct
);

export default router;
