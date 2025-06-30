// ✅ backend/src/routes/product/product_controller.ts
import {
  fetchCategoriesService,
  fetchCategoryService,
  createCategoryService,
  updateCategoryService,
  archiveCategoriesService,
  archiveCategoryService,
} from "./category_service.js";
import { success, error } from "../../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";
import { log } from "../../utils/logger.js";

/*
 * Controller pour la gestion des catégories
 * Contient les fonctions pour récupérer, créer, mettre à jour et supprimer des catégories
 */

// Récupération de toutes les catégories

export const fetchCategories = async (req, res, next) => {
  try {
    log.info("Récupération des categories", {
      query: req.query,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const result = await fetchCategoriesService();

    log.info("Categories récupérés avec succès", {
      resultCount: result.length,
      userId: req.session?.userId,
    });

    return success(res, result, "Categories récupérés avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération des Categories", {
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

// Récupération d'une catégorie par son ID

export const fetchCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.info("Récupération d'une categorie", {
      productId: id,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const product = await fetchCategoryService(id);

    if (!product) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "Categorie non trouvé",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["Le categorie demandé n'existe pas"] },
      });
    }

    return success(res, { product }, "Categorie récupéré avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération de la categorie", {
      error: err.message,
      productId: req.params.id,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération de la categorie",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

// Création d'une nouvelle catégorie

export const createCategory = async (req, res, next) => {
  try {
    log.userAction("create_category", req.user?.id, {
      productData: req.body,
      ip: req.ip,
    });

    const category = await createCategoryService(req.body);

    log.info("Categorie créé avec succès", {
      productId: category.id,
      adminId: req.user?.id,
    });

    return success(res, { category }, "Categorie créé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la création de la categorie", {
      error: err.message,
      productData: req.body,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la création de la categorie",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

// Mise à jour d'une catégorie existante

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("update_category", req.user?.id, {
      productId: id,
      updateData: req.body,
      ip: req.ip,
    });

    const category = await updateCategoryService(id, req.body);

    return success(res, { category }, "Categorie mis à jour avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la mise à jour de la categorie", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la mise à jour de la categorie",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

// Suppression des catégories (archivage)

export const archiveCategories = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("delete_product", req.user?.id, {
      productId: id,
      ip: req.ip,
    });

    await archiveCategoriesService(id);

    log.info("Categorie supprimé avec succès", {
      productId: id,
      adminId: req.user?.id,
    });

    return success(res, null, "Categorie supprimé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression de la categorie", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la suppression de la categorie",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

// Suppression d'une catégorie (archivage)

export const archiveCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("delete_product", req.user?.id, {
      productId: id,
      ip: req.ip,
    });

    await archiveCategoryService(id);

    log.info("Categorie supprimé avec succès", {
      productId: id,
      adminId: req.user?.id,
    });

    return success(res, null, "Categorie supprimé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression de la categorie", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la suppression de la categorie",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};
