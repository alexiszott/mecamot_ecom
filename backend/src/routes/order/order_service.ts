import {
  paginate,
  buildSearchFilter,
  extractPaginationParams,
  prismaPaginate,
} from "../../utils/pagination";

import { prisma } from "../../prismaClient.js";
import { log } from "../../utils/logger.js";

export const fetchOrdersService = async (query: any) => {
  query = {
    ...query,
  };

  log.info("Fetching orders with query", {
    query,
  });

  const paginationOptions = extractPaginationParams(query);

  const searchFields = ["firstname", "lastname", "email"];
  const where = buildSearchFilter(query, searchFields);

  let orderBy: any = { createdAt: "desc" };

  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    orderBy = { [sortField]: sortOrder };
  }

  log.info("Fetching order with : query, where and order", {
    orderBy,
    where,
    paginationOptions,
  });

  return await paginate(prismaPaginate.order, {
    ...paginationOptions,
    where,
    orderBy,
    include: {
      user: true,
      orderItems: true,
    },
  });
};

export const fetchOrderService = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: true,
    },
  });
};

export const createOrderService = async (data: any) => {
  return await prisma.order.create({
    data,
    include: {
      user: true,
      orderItems: true,
    },
  });
};

export const updateOrderService = async (id: string, data: any) => {
  return await prisma.order.update({
    where: { id },
    data,
    include: {
      user: true,
      orderItems: true,
    },
  });
};

export const archiveOrderService = async (id: string) => {
  return await prisma.order.update({
    where: { id },
    data: { isDeleted: true },
  });
};
