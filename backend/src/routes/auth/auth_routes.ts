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
import {
  idSchema,
  loginSchema,
  registerSchema,
} from "../../utils/validate_schema.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/query_validation.js";

const router = Router();

// Public routes
router.post("/signin", validateBody(loginSchema), authLimiter, login);
router.post("/signup", validateBody(registerSchema), registerLimiter, register);
router.post("/logout", generalLimiter, logout);
router.get("/verify/:id", validateParams(idSchema), generalLimiter, verifyUser);

// Protected routes
router.get("/me", requireAuth, checkAuth);

export default router;
