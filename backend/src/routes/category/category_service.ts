import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger.js";
import {
  buildSearchFilter,
  extractPaginationParams,
  paginate,
  prismaPaginate,
} from "../../utils/pagination.js";

export const fetchCategoriesService = async (query: any) => {
  query = {
    ...query,
    isDeleted: false,
  };

  log.info("Fetching categories with query", {
    query,
  });

  const paginationOptions = extractPaginationParams(query);

  log.info("Pagination options", {
    paginationOptions,
  });

  const searchFields = ["name", "description"];
  const where = buildSearchFilter(query, searchFields);

  log.info("Search filters", {
    where,
  });

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

export const fetchCategoryService = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};

export const createCategoryService = async (data: any) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? "",
      isDeleted: false,
    },
  });
};

export const updateCategoryService = async (id: string, data: any) => {
  return await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description ?? "",
      isDeleted: false,
    },
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

// Service pour récupérer toutes les catégories sans pagination
export const fetchAllCategoriesService = async (query: any = {}) => {
  log.info("Fetching all categories without pagination", {
    query,
  });

  const searchFields = ["name", "description"];
  const where = buildSearchFilter({ ...query, isDeleted: false }, searchFields);

  let orderBy: any = { name: "asc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  log.info("Fetching all categories with filters", {
    where,
    orderBy,
  });

  const categories = await prisma.category.findMany({
    where,
    orderBy,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    data: categories,
    count: categories.length,
  };
};
