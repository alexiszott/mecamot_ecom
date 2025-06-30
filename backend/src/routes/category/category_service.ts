import { prisma } from "../../prismaClient.js";

export const fetchCategoriesService = async () => {
  return await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { name: "desc" },
  });
};

export const fetchCategoryService = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const createCategoryService = async (data: any) => {
  return await prisma.category.create({
    data,
  });
};

export const updateCategoryService = async (id: string, data: any) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const archiveCategoriesService = async (ids: string[]) => {
  return await prisma.category.updateMany({
    where: { id: { in: ids } },
    data: { isDeleted: true },
  });
};

export const archiveCategoryService = async (id: string) => {
  return await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};
