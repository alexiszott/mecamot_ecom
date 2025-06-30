// ✅ backend/src/routes/product/product_service.ts
import {
  paginate,
  buildSearchFilter,
  extractPaginationParams,
  prismaPaginate,
} from "../../utils/pagination";
import { prisma } from "../../prismaClient.js";

export const fetchUsersService = async (query: any) => {
  const paginationOptions = extractPaginationParams(query);

  const searchFields = ["firstname", "lastname", "email", "phone"];
  const where = buildSearchFilter(query, searchFields);

  let orderBy: any = { createdAt: "desc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  return await paginate(prismaPaginate.user, {
    ...paginationOptions,
    where,
    orderBy,
  });
};

export const fetchUserService = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUserService = async (id: string, data: any) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUserService = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
