import { Router } from "express";
import {
  fetchUser,
  fetchUsers,
  deleteUser,
  updateUser,
} from "./user_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/query_validation.js";
import {
  idParamsSchema,
  paginationSchema,
  updateUserSchema,
} from "../../utils/validate_schema.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireAdmin,
  validateQuery(paginationSchema),
  fetchUsers
);
router.get(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  fetchUser
);

router.put(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(updateUserSchema),
  updateUser
);

router.put(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  deleteUser
);

export default router;
