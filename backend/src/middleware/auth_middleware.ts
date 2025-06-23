import { error } from "console";
import { HTTP_STATUS_CODES } from "../http_status_code";
import { findUserByIdService } from "../services/auth_service";

export const requireAuth = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Non autorisé - session manquante",
        code: HTTP_STATUS_CODES.Unauthorized,
      });
    }

    const user = await findUserByIdService(userId);

    if (!user) {
      req.session.destroy(() => {});
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Utilisateur non trouvé",
        code: HTTP_STATUS_CODES.Unauthorized,
      });
    }

    if (!user.isEmailVerified) {
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Email non vérifié",
        code: HTTP_STATUS_CODES.Unauthorized,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
