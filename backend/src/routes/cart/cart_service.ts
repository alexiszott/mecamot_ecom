import { prisma } from "../../prismaClient.js";

export const fetchCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      items: {
        select: {
          productId: true,
          price: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              brand: true,
              imageUrl: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return cart ?? null;
};

export const createCartService = async (userId: string) => {
  const cart = await prisma.cart.create({
    data: {
      userId,
      items: {
        create: [],
      },
    },
    select: {
      id: true,
      items: {
        select: {
          productId: true,
          price: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              brand: true,
              imageUrl: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return cart ?? [];
};
