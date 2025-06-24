import { HTTP_STATUS_CODES } from "../utils/http_status_code";
import { error } from "../utils/apiReponse";
import { fetchUserService } from "../routes/user/user_service";

export const requireAuth = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Non autorisé - session manquante",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { general: ["Non autorisé - session manquante"] },
      });
    }

    const user = await fetchUserService(userId);

    if (!user) {
      req.session.destroy(() => {});
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Utilisateur non trouvé",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { general: ["Utilisateur non trouvé"] },
      });
    }

    if (user.isDeleted) {
      req.session.destroy(() => {});
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Compte désactivé",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { general: ["Ce compte a été désactivé"] },
      });
    }

    if (!user.isEmailVerified) {
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Email non vérifié",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { general: ["Email non vérifié"] },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
