import { Router } from "express";
import {} from "./order_controller.js";
import {
  validateQuery,
  validateParams,
  validateBody,
} from "../../middleware/query_validation.js";
import { productQuerySchema } from "../../utils/validate_schema.js";

const router = Router();

// Public routes
router.get("/", validateQuery(productQuerySchema), fetchOrders);
router.post("/", validateQuery(productQuerySchema), fetchOrders);

export default router;
