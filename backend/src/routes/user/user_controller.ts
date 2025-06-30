import { success } from "../../utils/apiReponse.js";
import { log } from "../../utils/logger.js";
import {
  deleteUserService,
  fetchUserService,
  updateUserService,
} from "./user_service.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";

export const fetchUsers = async (req, res, next) => {
  try {
    log.info("Récupération des produits", {
      query: req.query,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const result = await fetchUserService(req.query);

    log.info("Produits récupérés avec succès", {
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      userId: req.session?.userId,
    });

    return success(res, result, "Produits récupérés avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération des produits", {
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
  try {
    const { id } = req.params;

    log.info("Récupération d'un produit", {
      productId: id,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const product = await fetchUserService(id);

    if (!product) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "Produit non trouvé",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["Le produit demandé n'existe pas"] },
      });
    }

    return success(res, { product }, "Produit récupéré avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération du produit", {
      error: err.message,
      productId: req.params.id,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération du produit",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("update_product", req.user?.id, {
      productId: id,
      updateData: req.body,
      ip: req.ip,
    });

    const product = await updateUserService(id, req.body);

    return success(res, { product }, "Produit mis à jour avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la mise à jour du produit", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la mise à jour du produit",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("delete_product", req.user?.id, {
      productId: id,
      ip: req.ip,
    });

    await deleteUserService(id);

    log.info("Produit supprimé avec succès", {
      productId: id,
      adminId: req.user?.id,
    });

    return success(res, null, "Produit supprimé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression du produit", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la suppression du produit",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};
