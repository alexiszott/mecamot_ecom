import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authMiddleware(req, res, next) {
  const token = req.cookies.sessionToken;
  if (!token) return res.status(401).json({ message: "Non authentifié" });

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
  });

  if (!session || session.expires < new Date()) {
    return res.status(401).json({ message: "Session expirée" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  req.user = user;
  next();
}
