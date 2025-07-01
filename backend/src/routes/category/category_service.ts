import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger.js";
import {
  buildSearchFilter,
  extractPaginationParams,
  paginate,
  prismaPaginate,
} from "../../utils/pagination.js";

export const fetchCategoriesPaginatedService = async (query: any) => {
  query = {
    ...query,
    isDeleted: false,
  };

  log.info("Fetching categories with query", {
    query,
  });

  // Extraire les paramètres de pagination
  const paginationOptions = extractPaginationParams(query);

  log.info("Pagination options", {
    paginationOptions,
  });

  // Construire les filtres de recherche
  const searchFields = ["name", "description"];
  const where = buildSearchFilter(query, searchFields);

  log.info("Search filters", {
    where,
  });

  // Options de tri
  let orderBy: any = { name: "desc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  log.info("Order by options", {
    orderBy,
  });

  return await paginate(prismaPaginate.category, {
    ...paginationOptions,
    where,
    orderBy,
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};

export const fetchCategoriesService = async () => {
  return await prisma.category.findMany();
};

export const fetchCategoryService = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const createCategoryService = async (data: any) => {
  return await prisma.category.create({
    data,
  });
};

export const updateCategoryService = async (id: string, data: any) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const archiveCategoriesService = async (ids: string[]) => {
  return await prisma.category.updateMany({
    where: { id: { in: ids } },
    data: { isDeleted: true },
  });
};

export const archiveCategoryService = async (id: string) => {
  return await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};
