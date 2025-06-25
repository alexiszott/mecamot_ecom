// ✅ backend/src/routes/product/product_service.ts
import {
  paginate,
  buildSearchFilter,
  extractPaginationParams,
  prismaPaginate,
} from "../../utils/pagination";

export const fetchProductsService = async (query: any) => {
  // Extraire les paramètres de pagination
  const paginationOptions = extractPaginationParams(query);

  // Construire les filtres de recherche
  const searchFields = ["name", "description", "brand"];
  const where = buildSearchFilter(query, searchFields);

  // Options de tri
  let orderBy: any = { createdAt: "desc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  return await paginate(prismaPaginate.product, {
    ...paginationOptions,
    where,
    orderBy,
    include: {
      categories: true,
    },
  });
};

export const fetchProductService = async (id: string) => {
  return await prismaPaginate.product.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });
};

export const createProductService = async (data: any) => {
  return await prismaPaginate.product.create({
    data,
    include: {
      categories: true,
    },
  });
};

export const updateProductService = async (id: string, data: any) => {
  return await prismaPaginate.product.update({
    where: { id },
    data,
    include: {
      categories: true,
    },
  });
};

export const deleteProductService = async (id: string) => {
  return await prismaPaginate.product.delete({
    where: { id },
  });
};
