import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const isUserExist = async (email: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email déjà utilisé");
};

export const createUser = async (
  email: string,
  hashPassword: string,
  firstname: string,
  lastname: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
      firstname: firstname,
      lastname: lastname,
      emailVerified: null,
    },
  });
  if (!user) throw new Error("Erreur lors de la création de l'utilisateur");
  return user;
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};
