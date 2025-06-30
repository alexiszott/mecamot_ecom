import { Router } from "express";
import {
  createProduct,
  archiveProduct,
  archiveProducts,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "./product_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  validateQuery,
  validateParams,
  validateBody,
} from "../../middleware/query_validation.js";
import {
  productQuerySchema,
  productParamsSchema,
  productBodySchema,
} from "../../utils/validate_schema.js";

const router = Router();

// Public routes
router.get("/", validateQuery(productQuerySchema), fetchProducts);
router.get("/:slug", validateQuery(productQuerySchema), fetchProduct);

// Protected routes

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(productBodySchema),
  createProduct
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(productParamsSchema),
  validateBody(productBodySchema),
  updateProduct
);

router.patch(
  "/:id/archive",
  requireAuth,
  requireAdmin,
  validateParams(productParamsSchema),
  archiveProduct
);

router.patch(
  "/archive",
  requireAuth,
  requireAdmin,
  //validateBody(productBodyArchiveSchema),
  archiveProducts
);

export default router;
