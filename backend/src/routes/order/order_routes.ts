import { Router } from "express";
import {
  createOrder,
  fetchOrder,
  fetchOrders,
  updateOrder,
} from "./order_controller.js";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../../middleware/query_validation.js";
import {
  orderBodySchema,
  orderQuerySchema,
  orderUpdateSchema,
  idParamsSchema,
} from "../../utils/validate_schema.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireAdmin,
  validateQuery(orderQuerySchema),
  fetchOrders
);

router.get("/:id", requireAuth, validateParams(idParamsSchema), fetchOrder);

router.post("/", requireAuth, validateBody(orderBodySchema), createOrder);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(orderUpdateSchema),
  updateOrder
);

export default router;
