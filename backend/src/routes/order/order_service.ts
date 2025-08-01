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

export const createOrderService = async (
  userId: string,
  data: any,
  prismaManager
) => {
  console.log("Creating order with data:", data);
  console.log("User ID:", userId);

  return await prismaManager.order.create({
    data: {
      userId: userId,
      subtotal: data.subTotal,
      shippingPrice: data.shippingPrice,
      totalPrice: data.totalPrice,
      taxPrice: data.taxPrice,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingPostalCode: data.shippingPostalCode,
      shippingCountry: data.shippingCountry,
      shippingPhone: data.shippingPhone,
      recipientName: data.recipientName,
    },
    select: {
      id: true,
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

export const cancelOrderService = async (id: string, data: any) => {
  return await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

export const archiveOrderService = async (id: string) => {
  return await prisma.order.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const validateStockBatchService = async (
  items: any[],
  prismaManager
) => {
  const productIds = items.map((item) => item.productId);

  const stockInfo = await prismaManager.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stock: true },
  });

  const reservations = await prismaManager.stockReservation.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds }, status: "ACTIVE" },
    _sum: { quantity: true },
  });
};

export const addReservationProductService = async (
  product: any,
  userId: string,
  prismaManager
) => {
  await prismaManager.stockReservation.create({
    data: {
      userId: userId,
      productId: product.id,
      quantity: product.quantity,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      status: "ACTIVE",
    },
  });
};

export const linkReservationsToOrderService = async (
  orderId: string,
  userId: string,
  prismaManager
) => {
  await prismaManager.stockReservation.updateMany({
    where: {
      userId,
      status: "ACTIVE",
      orderId: null,
    },
    data: {
      orderId: orderId,
      status: "CONFIRMED",
    },
  });
};

export const createOrderItemsService = async (
  orderId: string,
  userId: string,
  product: any,
  prismaManager
) => {
  await prismaManager.orderItem.create({
    data: {
      orderId: orderId,
      productId: product.id,
      quantity: product.quantity,
      price: product.price,
      totalWeight: product.weight,
    },
  });
};
