import { prisma } from "../../prismaClient.js";

export const isUserExistService = async (email: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  return !!existing;
};

export const createUserService = async (
  email: string,
  hashPassword: string,
  firstname: string,
  lastname: string,
  phone: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      isEmailVerified: false,
      cart: {
        create: {
          items: [],
        },
      },
    },
  });
  return user;
};

export const findUserByEmailService = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUserByIdService = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const sendVerifyTokenService = async (
  userId: string,
  rawToken: string
) => {
  await prisma.emailVerificationToken.create({
    data: {
      token: rawToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
};

export const deleteEmailVerificationTokenService = async (token: string) => {
  await prisma.emailVerificationToken.delete({ where: { token } });
};

export const getTokenEntryService = async (token: string) => {
  const tokenEntry = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  return tokenEntry;
};

export const verifyUserService = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      isEmailVerified: true,
      emailVerifiedDate: new Date(),
    },
  });
};
