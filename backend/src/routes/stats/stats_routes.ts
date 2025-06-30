import { Router } from "express";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import { getProductStats } from "./stats_controller.js";

const router = Router();

router.get("/products-stats", requireAuth, requireAdmin, getProductStats);

export default router;
