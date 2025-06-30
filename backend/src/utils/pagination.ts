// ✅ backend/src/utils/pagination.ts
import { PrismaClient } from "@prisma/client";
import { log } from "./logger.js"; // Assurez-vous que le logger est correctement importé

const prismaPaginate = new PrismaClient();

interface PaginationOptions {
  page?: number;
  limit?: number;
  skip?: number;
  orderBy?: any;
  where?: any;
  include?: any;
  select?: any;
}

// Interface pour le résultat paginé
interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

/**
 * Fonction de pagination générique pour Prisma
 * @param model - Le modèle Prisma (ex: prisma.user, prisma.product)
 * @param options - Options de pagination et filtres
 * @returns Résultat paginé avec métadonnées
 */
export async function paginate<T>(
  model: any,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const {
    page = 1,
    limit = 10,
    skip,
    orderBy = { createdAt: "desc" },
    where = {},
    include,
    select,
  } = options;

  // Calculer le skip si pas fourni
  const calculatedSkip = skip !== undefined ? skip : (page - 1) * limit;

  // Validation des paramètres
  if (page < 1) {
    log.error("Page number must be greater than 0", {
      page,
      limit,
      skip,
    });
    throw new Error("Le numéro de page doit être supérieur à 0");
  }

  if (limit < 1 || limit > 100) {
    log.error("Limit must be between 1 and 100", {
      page,
      limit,
      skip,
    });
    throw new Error("La limite doit être entre 1 et 100");
  }

  try {
    const queryOptions: any = {
      skip: calculatedSkip,
      take: limit,
      orderBy,
      where,
    };

    if (include) queryOptions.include = include;
    if (select) queryOptions.select = select;

    const [data, totalItems] = await Promise.all([
      model.findMany(queryOptions),
      model.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;

    return {
      data,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      },
    };
  } catch (error) {
    log.error("Erreur dans la pagination", {
      error: error.message,
      stack: error.stack,
    });
    throw new Error("Erreur lors de la récupération des données paginées");
  }
}

/**
 * Fonction helper pour extraire les paramètres de pagination depuis la requête
 * @param query - L'objet query de Express
 * @returns Options de pagination
 */
export function extractPaginationParams(query: any): PaginationOptions {
  const page = parseInt(query.page as string) || 1;
  const limit = Math.min(parseInt(query.limit as string) || 10, 100); // Max 100
  const skip = query.skip ? parseInt(query.skip as string) : undefined;

  return { page, limit, skip };
}

/**
 * Fonction pour construire les filtres de recherche
 * @param query - L'objet query de Express
 * @param searchFields - Champs sur lesquels effectuer la recherche
 * @returns Objet where pour Prisma
 */
export function buildSearchFilter(query: any, searchFields: string[] = []) {
  const where: any = {};

  // ✅ Filtrer par défaut les éléments supprimés
  if (query.isDeleted !== undefined) {
    where.isDeleted = query.isDeleted;
  }

  // Recherche générale
  if (query.search && searchFields.length > 0) {
    where.OR = searchFields.map((field) => ({
      [field]: {
        contains: query.search,
        mode: "insensitive",
      },
    }));
  }

  // Filtres spécifiques
  if (query.category && query.category !== "all") {
    where.category = {
      name: query.category,
    };
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.minPrice) {
    where.price = { ...where.price, gte: parseFloat(query.minPrice) };
  }

  if (query.maxPrice) {
    where.price = { ...where.price, lte: parseFloat(query.maxPrice) };
  }

  // Filtres de date
  if (query.startDate) {
    where.createdAt = { ...where.createdAt, gte: new Date(query.startDate) };
  }

  if (query.endDate) {
    where.createdAt = { ...where.createdAt, lte: new Date(query.endDate) };
  }

  if (query.stockFilter) {
    switch (query.stockFilter) {
      case "out":
        where.stock = 0;
        break;
      case "low":
        where.stock = { gt: 0, lte: 5 };
        break;
      case "available":
        where.stock = { gt: 5 };
        break;
    }
  }

  return where;
}

export { prismaPaginate };
