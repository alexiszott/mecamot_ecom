import { Router } from "express";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import { getProductStats, getUsersStats } from "./stats_controller.js";

const router = Router();

router.get("/products-stats", requireAuth, requireAdmin, getProductStats);
router.get("/users-stats", requireAuth, requireAdmin, getUsersStats);

export default router;
