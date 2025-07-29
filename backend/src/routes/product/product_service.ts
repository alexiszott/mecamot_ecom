import {
  paginate,
  buildSearchFilter,
  extractPaginationParams,
  prismaPaginate,
} from "../../utils/pagination";

import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger.js";
import { Prisma } from "@prisma/client";

export const fetchProductsService = async (query: any) => {
  query = {
    ...query,
    isDeleted: false,
    isPublished: true,
    //A MODIFIE
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

export const fetchAvailableStockService = async (id: string, manager) => {
  return await manager.product.findUnique({
    where: { id },
    select: {
      stock: true,
    },
  });
};

export const createProductService = async (data: any) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      stock: data.stock,
      brand: data.brand,
      isPublished: data.isPublished,
      slug: data.slug,
      sku: data.sku,
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : undefined,
    },
    include: {
      category: true,
    },
  });
};

export const updateProductService = async (id: string, data: any) => {
  return await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      stock: data.stock,
      brand: data.brand,
      isPublished: data.isPublished,
      slug: data.slug,
      category: data.category
        ? {
            connect: {
              id: data.category,
            },
          }
        : undefined,
    },
    include: {
      category: true,
    },
  });
};

export const updateStockProductService = async (item: any, prismaManager) => {
  const updated = await prismaManager.product.update({
    where: {
      id: item.productId,
      stock: {
        gte: item.quantity,
      },
    },
    data: {
      stock: {
        decrement: item.quantity,
      },
    },
  });

  if (updated.count === 0) {
    throw new Error(`Stock insuffisant pour le produit ${item.productId}`);
  }
};

export const archiveProductsService = async (ids: string[]) => {
  return await Promise.all(
    ids.map((id) => {
      const slug = `archived-${Date.now()}-${id}`;
      return prisma.product.update({
        where: { id },
        data: {
          isDeleted: true,
          isPublished: false,
          slug,
        },
      });
    })
  );
};

export const archiveProductService = async (id: string) => {
  const slug = `archived-${Date.now()}-${id}`;
  return await prisma.product.update({
    where: { id },
    data: { isDeleted: true, isPublished: false, slug: slug },
  });
};
