import { success } from "../../utils/apiReponse.js";
import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger.js";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";

// Cache pour les statistiques des produits
let cachedProductsStats = {
  totalProducts: 0,
  lowStockCount: 0,
  outOfStockCount: 0,
  totalValue: 0,
};
let lastProductFetch = 0;

export const getProductStats = async (req, res, next) => {
  const now = Date.now();

  if (cachedProductsStats && now - lastProductFetch < 30000) {
    log.info("Récupération des statistiques des produits (cache)", {
      userId: req.session?.userId,
      ip: req.ip,
    });
    return success(
      res,
      cachedProductsStats,
      "Statistiques des produits récupérées avec succès (cache)"
    );
  }

  try {
    log.info("Récupération des statistiques des produits", {
      userId: req.session?.userId,
      ip: req.ip,
    });

    const stats = await prisma.product.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        stock: true,
      },
      where: {
        isDeleted: false,
      },
    });

    const outOfStock = await prisma.product.count({
      where: {
        stock: 0,
        isDeleted: false,
      },
    });

    const lowStock = await prisma.product.count({
      where: {
        stock: {
          gt: 0,
          lte: 5,
        },
        isDeleted: false,
      },
    });

    const totalValueResult: any = await prisma.$queryRaw`
      SELECT SUM(price * stock) as total_value 
      FROM "Product"
      WHERE "isDeleted" = false
    `;

    const totalValue = totalValueResult[0]?.total_value ?? 0;

    log.info("Statistiques des produits récupérées", {
      totalProducts: stats._count.id,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalValue: totalValue,
    });

    const result = {
      totalProducts: stats._count.id,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalValue: totalValue ?? 0,
    };

    cachedProductsStats = result;
    lastProductFetch = now;

    return success(
      res,
      result,
      "Statistiques des produits récupérées avec succès"
    );
  } catch (error) {
    log.error("Erreur lors de la récupération des statistiques des produits", {
      error: error.message,
      stack: error.stack,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération des produits",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};

export const getUsersStats = async (req, res, next) => {
  try {
    log.info("Récupération des statistiques des users", {
      userId: req.session?.userId,
      ip: req.ip,
    });

    const stats = await prisma.user.aggregate({
      _count: {
        id: true,
      },
      where: {
        isDeleted: false,
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsersCount = await prisma.user.count({
      where: {
        lastLogin: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const lowStock = await prisma.product.count({
      where: {
        stock: {
          gt: 0,
          lte: 5,
        },
        isDeleted: false,
      },
    });

    const totalValueResult: any = await prisma.$queryRaw`
      SELECT SUM(price * stock) as total_value 
      FROM "Product"
      WHERE "isDeleted" = false
    `;

    const totalValue = totalValueResult[0]?.total_value ?? 0;

    log.info("Statistiques des produits récupérées", {
      totalProducts: stats._count.id,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalValue: totalValue,
    });

    const result = {
      totalProducts: stats._count.id,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalValue: totalValue ?? 0,
    };

    return success(
      res,
      result,
      "Statistiques des produits récupérées avec succès"
    );
  } catch (error) {
    log.error("Erreur lors de la récupération des statistiques des produits", {
      error: error.message,
      stack: error.stack,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.InternalServerError,
      message: "Erreur lors de la récupération des produits",
      code: HTTP_STATUS_CODES.InternalServerError,
      errors: { general: ["Erreur interne du serveur"] },
    });
  }
};
