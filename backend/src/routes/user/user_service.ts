// ✅ backend/src/routes/product/product_service.ts
import {
  paginate,
  buildSearchFilter,
  extractPaginationParams,
  prismaPaginate,
} from "../../utils/pagination";
import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger";

export const fetchUsersService = async (query: any) => {
  query = {
    ...query,
    role: "USER",
  };

  log.info("Fetching users with query", {
    query,
  });

  const paginationOptions = extractPaginationParams(query);

  log.info("Pagination options", {
    paginationOptions,
  });

  const searchFields = ["lastname", "firstname", "email", "phone"];
  const where = buildSearchFilter(query, searchFields);

  log.info("Search filters", {
    where,
  });

  let orderBy: any = { createdAt: "desc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  log.info("Order by options", {
    orderBy,
  });

  return await paginate(prismaPaginate.user, {
    ...paginationOptions,
    where,
    orderBy,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      isEmailVerified: true,
      emailVerifiedDate: true,
      createdAt: true,
      updatedAt: true,
    },
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
