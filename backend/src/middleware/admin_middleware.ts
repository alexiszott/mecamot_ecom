import { HTTP_STATUS_CODES } from "../utils/http_status_code";
import { error } from "../utils/apiReponse";
import { log } from "../utils/logger";
import { fetchUserService } from "../routes/user/user_service";

export const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      log.security("Tentative d'accès admin sans session", {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers["user-agent"],
      });

      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Accès non autorisé - authentification requise",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: {
          general: ["Vous devez être connecté pour accéder à cette ressource"],
        },
      });
    }

    const user = await fetchUserService(userId);

    if (!user) {
      log.security("Tentative d'accès admin avec utilisateur inexistant", {
        userId,
        ip: req.ip,
        path: req.path,
      });

      req.session.destroy(() => {});

      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Utilisateur non trouvé",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { general: ["Session invalide"] },
      });
    }

    if (!user.isEmailVerified) {
      log.security("Tentative d'accès admin avec email non vérifié", {
        userId: user.id,
        email: user.email,
        ip: req.ip,
        path: req.path,
      });

      return error(res, {
        status: HTTP_STATUS_CODES.Forbidden,
        message: "Email non vérifié",
        code: HTTP_STATUS_CODES.Forbidden,
        errors: {
          general: [
            "Veuillez vérifier votre email avant d'accéder aux fonctions administratives",
          ],
        },
      });
    }

    if (user.role !== "ADMIN") {
      log.security("Tentative d'accès admin par utilisateur non-admin", {
        userId: user.id,
        email: user.email,
        role: user.role,
        ip: req.ip,
        path: req.path,
        userAgent: req.headers["user-agent"],
      });

      return error(res, {
        status: HTTP_STATUS_CODES.Forbidden,
        message: "Accès interdit - privilèges administrateur requis",
        code: HTTP_STATUS_CODES.Forbidden,
        errors: {
          general: ["Vous n'avez pas les droits administrateur nécessaires"],
        },
      });
    }

    log.auth("Accès admin autorisé", {
      userId: user.id,
      email: user.email,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    req.user = user;
    req.isAdmin = true;

    next();
  } catch (err: any) {
    log.error("Erreur dans le middleware admin", {
      error: err.message,
      stack: err.stack,
      userId: req.session?.userId,
      ip: req.ip,
      path: req.path,
    });
    next(err);
  }
};
