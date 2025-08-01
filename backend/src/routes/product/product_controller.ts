// ✅ backend/src/routes/product/product_controller.ts
import {
  fetchProductsService,
  fetchProductService,
  createProductService,
  updateProductService,
  archiveProductsService,
  archiveProductService,
} from "./product_service.js";
import { success, error } from "../../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";
import { log } from "../../utils/logger.js";
import {
  generateSkuCode,
  generateSlugCode,
} from "../../utils/generate_slug_sku.js";

export const fetchProducts = async (req, res, next) => {
  try {
    log.info("Récupération des produits", {
      query: req.query,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const result = await fetchProductsService(req.query);

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

export const fetchProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.info("Récupération d'un produit", {
      productId: id,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const product = await fetchProductService(id);

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

export const createProduct = async (req, res, next) => {
  try {
    log.userAction("create_product", req.user?.id, {
      productData: req.body,
      ip: req.ip,
    });

    req.body.slug = generateSlugCode(req.body.name);

    req.body.sku = generateSkuCode(req.body.name);

    const product = await createProductService(req.body);

    log.info("Produit créé avec succès", {
      productId: product.id,
      adminId: req.user?.id,
    });

    return success(res, { product }, "Produit créé avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la création du produit", {
      error: err.message,
      productData: req.body,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la création du produit",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("update_product", req.user?.id, {
      productId: id,
      updateData: req.body,
      ip: req.ip,
    });

    req.body.slug = generateSlugCode(req.body.name);

    const product = await updateProductService(id, req.body);

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

// Function to archive X products

export const archiveProducts = async (req, res, next) => {
  try {
    const { ids } = req.body;

    log.userAction("delete bulk products", req.user?.id, {
      productId: ids,
      ip: req.ip,
    });

    await archiveProductsService(ids);

    log.info("Produits supprimés avec succès", {
      productId: ids,
      adminId: req.user?.id,
    });

    return success(res, null, "Produits supprimés avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la suppression des produits", {
      error: err.message,
      productId: req.params.id,
      adminId: req.user?.id,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la suppression des produits",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

// Function to archive 1 product

export const archiveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    log.userAction("delete_product", req.user?.id, {
      productId: id,
      ip: req.ip,
    });

    await archiveProductService(id);

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
