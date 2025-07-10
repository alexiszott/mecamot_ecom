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
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  return cart;
};

export const fetchExistingItemService = async (
  productId: string,
  cartId: string
) => {
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cartId,
        productId: productId,
      },
    },
  });

  return existingItem;
};

export const addItemToCartService = async (
  product,
  cartId: string,
  quantity: number,
  existingItem: boolean
) => {
  if (existingItem) {
    return await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cartId,
          productId: product.id,
        },
      },
      data: {
        quantity: { increment: quantity },
      },
    });
  } else {
    return await prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: product.id,
        quantity,
        price: product.price,
      },
    });
  }
};
