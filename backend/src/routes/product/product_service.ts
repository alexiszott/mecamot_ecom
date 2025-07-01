import {
  paginate,
  buildSearchFilter,
  extractPaginationParams,
  prismaPaginate,
} from "../../utils/pagination";

import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger.js";

export const fetchProductsService = async (query: any) => {
  query = {
    ...query,
    isDeleted: false,
  };

  log.info("Fetching products with query", {
    query,
  });

  // Extraire les paramètres de pagination
  const paginationOptions = extractPaginationParams(query);

  log.info("Pagination options", {
    paginationOptions,
  });

  // Construire les filtres de recherche
  const searchFields = ["name", "description", "brand"];
  const where = buildSearchFilter(query, searchFields);

  log.info("Search filters", {
    where,
  });

  // Options de tri
  let orderBy: any = { createdAt: "desc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  log.info("Order by options", {
    orderBy,
  });

  return await paginate(prismaPaginate.product, {
    ...paginationOptions,
    where,
    orderBy,
    include: {
      category: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      imageUrl: true,
      slug: true,
      isPublished: true,
      sku: true,
      brand: true,
      categoryid: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const fetchProductService = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const createProductService = async (data: any) => {
  return await prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
};

export const updateProductService = async (id: string, data: any) => {
  console.log("\n\n\nUpdating product with ID:", id, "Data:\n\n\n", data);
  return await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const archiveProductsService = async (ids: string[]) => {
  return await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { isDeleted: true },
  });
};

export const archiveProductService = async (id: string) => {
  return await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
};
