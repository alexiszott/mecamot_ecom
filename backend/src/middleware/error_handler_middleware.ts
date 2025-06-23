import { Request, Response, NextFunction } from "express";
import { error } from "../utils/apiReponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[Erreur serveur]", err);

  const status = err.status || 500;
  const message = err.message || "Erreur serveur";
  const code = err.code || status;

  return error(res, { status, message, code, errors: err.errors || null });
};
