import { Router } from "express";
import {
  login,
  register,
  verifyUser,
  logout,
  checkAuth,
} from "./auth_controller.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  authLimiter,
  generalLimiter,
  registerLimiter,
} from "../../utils/rate_limit_handler.js";

const router = Router();

// Public routes
router.post("/signin", authLimiter, login);
router.post("/signup", registerLimiter, register);
router.post("/logout", generalLimiter, logout);
router.get("/verify/:id", generalLimiter, verifyUser);

// Protected routes
router.get("/me", requireAuth, checkAuth);

export default router;
