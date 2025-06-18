import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend fonctionne correctement!" });
});

app.use(express.json());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
