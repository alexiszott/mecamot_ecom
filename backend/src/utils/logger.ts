// ✅ backend/src/utils/logger.ts
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// Niveaux de log personnalisés
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  auth: 3,
  security: 4,
  debug: 5,
};

// Couleurs pour la console
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  auth: "green",
  security: "magenta",
  debug: "gray",
});

// Format personnalisé
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` | Meta: ${JSON.stringify(meta)}`;
    }

    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

// Configuration des transports
const transports: winston.transport[] = [
  // Console (développement)
  new winston.transports.Console({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: consoleFormat,
  }),

  // Fichiers rotatifs pour tous les logs
  new DailyRotateFile({
    filename: path.join(process.cwd(), "logs", "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    format: logFormat,
    level: "info",
  }),

  // Fichier spécifique pour les erreurs
  new DailyRotateFile({
    filename: path.join(process.cwd(), "logs", "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "30d",
    format: logFormat,
    level: "error",
  }),

  // Fichier spécifique pour la sécurité/auth
  new DailyRotateFile({
    filename: path.join(process.cwd(), "logs", "security-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "90d",
    format: logFormat,
    level: "security",
  }),
];

// Créer le logger
const logger = winston.createLogger({
  levels: logLevels,
  transports,
  exitOnError: false,
});

// Wrapper avec méthodes pratiques
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Méthodes spécialisées
  auth: (message: string, meta?: any, p0?: { ip: any; sessionId: any }) =>
    logger.log("auth", message, meta),
  security: (message: string, meta?: any) =>
    logger.log("security", message, meta),

  // Méthodes d'e-commerce
  userAction: (action: string, userId: string, meta?: any) => {
    logger.info(`User Action: ${action}`, { userId, ...meta });
  },

  apiRequest: (method: string, path: string, userId?: string, meta?: any) => {
    logger.info(`API ${method} ${path}`, { userId, ...meta });
  },

  authAttempt: (email: string, success: boolean, ip: string, meta?: any) => {
    logger.log("auth", `Login attempt: ${email}`, {
      success,
      ip,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  },

  securityEvent: (event: string, ip: string, meta?: any) => {
    logger.log("security", `Security Event: ${event}`, { ip, ...meta });
  },
};

export default logger;
