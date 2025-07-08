import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth/auth_routes.js";
import userRoutes from "./routes/user/user_routes.js";
import productRoutes from "./routes/product/product_routes.js";
import statsRoutes from "./routes/stats/stats_routes.js";
import categoryRoutes from "./routes/category/category_routes.js";
import cartsRoutes from "./routes/cart/cart_routes.js";

import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/error_handler_middleware";
import cookieParser from "cookie-parser";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";
import helmet from "helmet";
import { requestLogger } from "./middleware/logger_middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

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
    methods: ["GET", "POST", "PUT", "PATCH"],
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
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "connect.sid",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
    rolling: true,
  })
);

// PROTECTION AGAINST DDOS

app.use(helmet());

// LOGGING

app.use(requestLogger);

//ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/carts", cartsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API START

app.listen(PORT, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${PORT}
    `);
  console.log("✅ Serveur Swagger on http://localhost:3000/api-docs");
});

// API DISCONNECT

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Error handling middleware

app.use(errorHandler);
