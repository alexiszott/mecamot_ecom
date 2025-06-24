import { prisma } from "../../prismaClient.js";

export const fetchUsersService = async (limit: number, skip: number) => {
  return await Promise.all([
    prisma.user.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);
};

export const fetchUserService = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

export const softDeleteUserService = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });
};

export const updateUserService = async (userId, updates) => {
  return await prisma.user.update({
    where: { id: userId },
    data: updates,
  });
};
