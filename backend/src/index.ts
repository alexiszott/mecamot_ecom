import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/error_handler_middleware";
import cookieParser from "cookie-parser";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://votre-domaine.com"
        : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 200,
  })
);

const PgSession = pgSession(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "user_sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// PROTECTION AGAINST DDOS

app.use(helmet());
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives, réessayez plus tard" },
  standardHeaders: true,
  legacyHeaders: false,
});

//ROUTES

app.use("/api/auth", authRoutes);

// API START

app.listen(PORT, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${PORT}`);
});

// API DISCONNECT

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Error handling middleware

app.use(errorHandler);
