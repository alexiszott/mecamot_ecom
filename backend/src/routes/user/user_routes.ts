import { Router } from "express";
import {
  fetchUser,
  fetchUsers,
  deleteUser,
  updateUser,
} from "./user_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, fetchUsers);
router.get("/:id", requireAuth, requireAdmin, fetchUser);
router.patch("/:id", requireAuth, requireAdmin, updateUser);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);

export default router;
