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
  idSchema,
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
  validateParams(idSchema),
  fetchUser
);
router.put(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  validateBody(updateUserSchema),
  updateUser
);
router.delete(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  deleteUser
);

export default router;
