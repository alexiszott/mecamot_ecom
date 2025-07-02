import { Router } from "express";
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  archiveOrder,
} from "./order_controller.js";
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
router.get("/", validateQuery(productQuerySchema), fetchOrders);
router.get("/:id", requireAuth, validateQuery(productQuerySchema), fetchOrder);

// Protected routes

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(productBodySchema),
  createOrder
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(productParamsSchema),
  validateBody(productBodySchema),
  updateOrder
);

router.put(
  "/:id/archive",
  requireAuth,
  requireAdmin,
  validateParams(productParamsSchema),
  archiveOrder
);

export default router;
