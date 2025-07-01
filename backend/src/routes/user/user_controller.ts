import { error, success } from "../../utils/apiReponse.js";
import { log } from "../../utils/logger.js";
import { fetchUserService } from "./user_service.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";

export const fetchUsers = async (req, res, next) => {
  try {
    log.info("Récupération des utilisateurs", {
      query: req.query,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const result = await fetchUserService(req.query);

    if (!result) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "Aucun utilisateur trouvé",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["Aucun utilisateur trouvé"] },
      });
    }

    log.info("Utilisateurs récupérés avec succès", {
      userId: req.session?.userId,
    });

    return success(res, result, "Produits récupérés avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération des utilisateurs", {
      error: err.message,
      query: req.query,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération des produits",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const fetchUser = async (req, res, next) => {
  //TODO
};

export const updateUser = async (req, res, next) => {
  //TODO
};

export const deleteUser = async (req, res, next) => {
  //TODO
};
