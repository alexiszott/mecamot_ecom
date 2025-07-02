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
  idParamsSchema,
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
  validateParams(idParamsSchema),
  validateBody(productBodySchema),
  updateProduct
);

router.put(
  "/:id/archive",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  archiveProduct
);

router.put(
  "/archive",
  requireAuth,
  requireAdmin,
  //validateBody(productBodyArchiveSchema),
  archiveProducts
);

export default router;
