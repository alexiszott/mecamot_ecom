import { HTTP_STATUS_CODES } from "./http_status_code";
import { error } from "./apiReponse";
import { log } from "./logger";
import rateLimit from "express-rate-limit";

export const rateLimitHandler = (customMessage?: string) => (req, res) => {
  const message = customMessage || "Trop de requêtes";

  log.security("Rate limit dépassé", {
    ip: req.ip,
    path: req.path,
    userAgent: req.headers["user-agent"],
    email: req.body?.email,
    message,
  });

  return error(res, {
    status: HTTP_STATUS_CODES.TooManyRequests,
    message: customMessage || "Trop de tentatives. Réessayez plus tard.",
    code: HTTP_STATUS_CODES.TooManyRequests,
    errors: {
      general: [customMessage || "Trop de tentatives. Réessayez plus tard."],
    },
  });
};

export const authLimiter = rateLimit({
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

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Limite d'inscriptions atteinte. Réessayez dans 1 heure."
  ),
  skipSuccessfulRequests: true,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: rateLimitHandler("Trop de requêtes. Réessayez plus tard."),
  skipSuccessfulRequests: true,
});
