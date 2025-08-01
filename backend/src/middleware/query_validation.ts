// ✅ backend/src/middleware/query_validation.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { error } from "../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../utils/http_status_code.js";
import { log } from "../utils/logger.js";

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      log.debug("Validation des query parameters", {
        query: req.query,
        path: req.path,
      });

      const result = schema.safeParse(req.query);

      if (!result.success) {
        log.warn("Validation des query parameters échouée", {
          errors: result.error.flatten().fieldErrors,
          query: req.query,
          path: req.path,
          ip: req.ip,
        });

        return error(res, {
          status: HTTP_STATUS_CODES.BadRequest,
          message: "Paramètres de requête invalides",
          code: HTTP_STATUS_CODES.BadRequest,
          errors: result.error.flatten().fieldErrors,
        });
      }

      Object.assign(req.query, result.data);

      log.debug("Query parameters validés avec succès", {
        validatedQuery: req.query,
        path: req.path,
      });

      next();
    } catch (err: any) {
      log.error("Erreur lors de la validation des query parameters", {
        error: err.message,
        query: req.query,
        path: req.path,
      });

      return error(res, {
        status: HTTP_STATUS_CODES.InternalServerError,
        message: "Erreur de validation",
        code: HTTP_STATUS_CODES.InternalServerError,
        errors: { general: ["Erreur interne du serveur"] },
      });
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      log.debug("Validation du body", {
        body: req.body,
        path: req.path,
      });

      const result = schema.safeParse(req.body);

      if (!result.success) {
        log.warn("Validation du body échouée", {
          errors: result.error.flatten().fieldErrors,
          body: req.body,
          path: req.path,
          ip: req.ip,
        });

        return error(res, {
          status: HTTP_STATUS_CODES.BadRequest,
          message: "Données du body invalides",
          code: HTTP_STATUS_CODES.BadRequest,
          errors: result.error.flatten().fieldErrors,
        });
      }

      req.body = result.data;

      log.debug("Body validé avec succès", {
        validatedBody: req.body,
        path: req.path,
      });

      next();
    } catch (err: any) {
      log.error("Erreur lors de la validation du body", {
        error: err.message,
        body: req.body,
        path: req.path,
      });

      return error(res, {
        status: HTTP_STATUS_CODES.InternalServerError,
        message: "Erreur de validation",
        code: HTTP_STATUS_CODES.InternalServerError,
        errors: { general: ["Erreur interne du serveur"] },
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        log.warn("Validation des paramètres échouée", {
          errors: result.error.flatten().fieldErrors,
          params: req.params,
          path: req.path,
        });

        return error(res, {
          status: HTTP_STATUS_CODES.BadRequest,
          message: "Paramètres invalides",
          code: HTTP_STATUS_CODES.BadRequest,
          errors: result.error.flatten().fieldErrors,
        });
      }

      req.params = result.data;
      next();
    } catch (err: any) {
      log.error("Erreur lors de la validation des paramètres", {
        error: err.message,
        params: req.params,
      });

      return error(res, {
        status: HTTP_STATUS_CODES.InternalServerError,
        message: "Erreur de validation",
        code: HTTP_STATUS_CODES.InternalServerError,
        errors: { general: ["Erreur interne du serveur"] },
      });
    }
  };
};
