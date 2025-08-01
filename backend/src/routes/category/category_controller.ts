// ✅ backend/src/routes/product/product_controller.ts
import {
  fetchCategoryService,
  createCategoryService,
  updateCategoryService,
  archiveCategoriesService,
  archiveCategoryService,
  fetchCategoriesService,
  fetchAllCategoriesService,
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

    // Si des paramètres de pagination sont présents, utiliser le service paginé
    const hasPaginationParams = req.query.page || req.query.limit;

    let result;

    if (hasPaginationParams) {
      // Mode paginé
      result = await fetchCategoriesService(req.query);

      log.info("Catégories récupérées avec pagination", {
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
        userId: req.session?.userId,
      });
    } else {
      // Mode toutes les catégories
      const categoriesData = await fetchAllCategoriesService(req.query);

      result = {
        data: categoriesData.data,
        // Pas d'objet pagination pour le mode "all"
      };

      log.info("Toutes les catégories récupérées", {
        totalItems: categoriesData.count,
        userId: req.session?.userId,
      });
    }

    return success(res, result, "Categories récupérées avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération des Categories", {
      error: err.message,
      query: req.query,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération des catégories",
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

    const category = await fetchCategoryService(id);

    if (!category) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "Categorie non trouvé",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["Le categorie demandé n'existe pas"] },
      });
    }

    return success(res, { category }, "Categorie récupéré avec succès");
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
    const { ids } = req.body;

    log.userAction("delete bulk products", req.user?.id, {
      productId: ids,
      ip: req.ip,
    });

    await archiveCategoriesService(ids);

    log.info("Categories supprimées avec succès", {
      productId: ids,
      adminId: req.user?.id,
    });

    return success(res, null, "Categories supprimées avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression des categories", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la suppression des categories",
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
      categoryId: id,
      ip: req.ip,
    });

    await archiveCategoryService(id);

    log.info("Categorie supprimé avec succès", {
      categoryId: id,
      adminId: req.user?.id,
    });

    return success(res, null, "Categorie supprimé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression de la categorie", {
      error: err.message,
      categoryId: req.params.id,
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
