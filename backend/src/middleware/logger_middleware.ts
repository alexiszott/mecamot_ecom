// ✅ backend/src/middleware/logging_middleware.ts
import { Request, Response, NextFunction } from "express";
import { log } from "../utils/logger.js";

interface LoggedRequest extends Request {
  session: any;
  startTime?: number;
  user?: any;
}

export const requestLogger = (
  req: LoggedRequest,
  res: Response,
  next: NextFunction
) => {
  req.startTime = Date.now();

  log.apiRequest(req.method, req.path, req.session?.userId, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    query: req.query,
    body: req.method === "POST" ? sanitizeBody(req.body) : undefined,
  });

  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - (req.startTime || 0);

    log.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      userId: req.session?.userId,
      duration: `${duration}ms`,
      ip: req.ip,
      statusCode: res.statusCode,
    });

    if (res.statusCode >= 400) {
      log.warn(`HTTP Error ${res.statusCode}`, {
        method: req.method,
        path: req.path,
        userId: req.session?.userId,
        ip: req.ip,
        body: sanitizeBody(req.body),
        response: body ? JSON.parse(body).message : "No message",
      });
    }

    return originalSend.call(this, body);
  };

  next();
};

const sanitizeBody = (body: any) => {
  if (!body) return undefined;

  const sanitized = { ...body };

  const sensitiveFields = ["password", "token", "secret", "key"];
  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
};
