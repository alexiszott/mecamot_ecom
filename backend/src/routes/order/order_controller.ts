// ✅ backend/src/routes/product/product_controller.ts
import {
  fetchProductsService,
  fetchProductService,
  createProductService,
  updateProductService,
  archiveProductsService,
  archiveProductService,
} from "./order_service.js";
import { success, error } from "../../utils/apiReponse.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";
import { log } from "../../utils/logger.js";

export const fetchOrders = async (req, res, next) => {
  try {
    log.info("Récupération des commandes", {
      query: req.query,
      userId: req.session?.userId,
      ip: req.ip,
    });

    const result = await fetchOrdersService(req.query);

    log.info("Commandes récupérés avec succès", {
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      userId: req.session?.userId,
    });

    return success(res, result, "Commandes récupérés avec succès");
  } catch (err: any) {
    log.error("Erreur lors de la récupération des commandes", {
      error: err.message,
      query: req.query,
      userId: req.session?.userId,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération des commandes",
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

    const slug = req.body.name
      .toLowerCase()
      .normalize("NFD") // enlève les accents (é → e)
      .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
      .replace(/[^a-z0-9\s-]/g, "") // enlève les caractères spéciaux sauf tirets/espaces
      .trim()
      .replace(/\s+/g, "-") // remplace les espaces par des tirets
      .replace(/-+/g, "-") // supprime les tirets multiples
      .slice(0, 100);

    console.log("Slug généré :", slug);

    req.body.slug = slug;

    const prefix = req.body.name
      .toUpperCase()
      .normalize("NFD") // supprime accents
      .replace(/[\u0300-\u036f]/g, "") // ex: É → E
      .replace(/[^A-Z0-9]/g, "") // enlève tout sauf lettres/chiffres
      .slice(0, 5); // on prend les 5 premiers caractères

    const random = Math.floor(1000 + Math.random() * 9000);

    const sku = `${prefix}-${random}`;

    req.body.sku = sku;

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
