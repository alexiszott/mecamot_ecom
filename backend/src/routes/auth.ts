import { Router } from "express";
import {
  login,
  register,
  verifyUser,
  me,
  logout,
  checkAuth,
} from "../controllers/auth_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import rateLimit from "express-rate-limit";
import { error } from "../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../http_status_code.js";

const router = Router();

const rateLimitHandler = (customMessage?: string) => (req, res) => {
  return error(res, {
    status: HTTP_STATUS_CODES.TooManyRequests,
    message: customMessage || "Trop de tentatives. Réessayez plus tard.",
    code: HTTP_STATUS_CODES.TooManyRequests,
    errors: {
      general: [customMessage || "Trop de tentatives. Réessayez plus tard."],
    },
  });
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${req.ip}-${req.body.email || "no-email"}`,
  handler: rateLimitHandler(
    "Trop de tentatives de connexion. Réessayez plus tard."
  ),
  skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Limite d'inscriptions atteinte. Réessayez dans 1 heure."
  ),
  skipSuccessfulRequests: true,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: rateLimitHandler("Trop de requêtes. Réessayez plus tard."),
  skipSuccessfulRequests: true,
});

// Public routes
router.post("/signin", authLimiter, login);
router.post("/signup", registerLimiter, register);
router.post("/logout", generalLimiter, logout);
router.get("/verify", generalLimiter, verifyUser);

// Protected routes
router.get("/me", requireAuth, checkAuth);

export default router;
