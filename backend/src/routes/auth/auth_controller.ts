import {
  isUserExistService,
  createUserService,
  findUserByEmailService,
  verifyUserService,
  sendVerifyTokenService,
  getTokenEntryService,
  deleteEmailVerificationTokenService,
  findUserByIdService,
  updateLastLoginService,
  updateLastActivityService,
} from "./auth_service.js";
import bcrypt from "bcrypt";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";
import { error, success } from "../../utils/apiReponse.js";
import crypto from "crypto";
import { log } from "../../utils/logger.js";

export const register = async (req, res, next) => {
  const { email, password, confirmPassword, firstname, lastname, phone } =
    req.body;

  if (password !== confirmPassword) {
    log.error("register password mismatch", {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      email: email,
    });

    return error(res, {
      status: HTTP_STATUS_CODES.UnprocessableEntity,
      message: "Les mots de passe ne correspondent pas",
      code: HTTP_STATUS_CODES.UnprocessableEntity,
      errors: { confirmPassword: ["Les mots de passe ne correspondent pas"] },
    });
  }

  try {
    log.auth("Tentative d'inscription", {
      email,
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      firstname,
      lastname,
      phone,
    });

    const exist = await isUserExistService(email);

    if (exist) {
      return error(res, {
        status: HTTP_STATUS_CODES.Conflict,
        message: "L'email est déjà utilisé",
        code: HTTP_STATUS_CODES.Conflict,
        errors: { email: ["Cet email est déjà utilisé"] },
      });
    }

    log.auth("Email non trouvé, création de l'utilisateur", {
      email,
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
    });

    const hashed = await bcrypt.hash(password, 16);

    const user = await createUserService(
      email,
      hashed,
      firstname ?? "",
      lastname ?? "",
      phone ?? ""
    );

    if (!user) {
      log.error("Échec de l'inscription", {
        email,
        ip: req.ip,
        sessionId: req.sessionID,
        userAgent: req.headers["user-agent"],
      });

      return error(res, {
        status: HTTP_STATUS_CODES.UnprocessableEntity,
        message: "Echec de l'inscription",
        code: HTTP_STATUS_CODES.UnprocessableEntity,
        errors: { general: ["Echec de l'inscription"] },
      });
    }

    const userId = user.id;

    const rawToken = crypto.randomBytes(32).toString("hex");

    await sendVerifyTokenService(userId, rawToken);

    log.auth("Token de vérification envoyé", {
      userId,
      email: user.email,
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
    });

    const url = `http://localhost:3001/api/auth/verify?token=${rawToken}`;

    log.info("Lien de vérification envoyé par email", {
      userId,
      url: url,
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
    });

    log.info("Inscription réussie, utilisateur créé", {
      userId,
      email: user.email,
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
    });

    return success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
        },
      },
      "Inscription réussie",
      HTTP_STATUS_CODES.Created
    );
  } catch (error) {
    log.error("Erreur inattendue lors de l'inscription", {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return error(res, {
      status: HTTP_STATUS_CODES.BadRequest,
      message: "Token manquant ou invalide",
      code: HTTP_STATUS_CODES.BadRequest,
      errors: { general: ["Token manquant ou invalide"] },
    });
  }

  const tokenEntry = await getTokenEntryService(token);

  if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
    return error(res, {
      status: HTTP_STATUS_CODES.BadRequest,
      message: "Lien expiré ou invalide",
      code: HTTP_STATUS_CODES.BadRequest,
      errors: { general: ["Lien expiré ou invalide"] },
    });
  }

  await verifyUserService(tokenEntry.userId);
  await deleteEmailVerificationTokenService(token);

  return success(
    res,
    { verified: true },
    "Email vérifié avec succès",
    HTTP_STATUS_CODES.OK
  );
};

// LOGIN

export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    log.auth(`Tentative de connexion pour: ${email}`, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      rememberMe,
    });

    const user = await findUserByEmailService(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      log.security("Échec de connexion - identifiants invalides", {
        email,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Email ou mot de passe incorrect",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { email: ["Email ou mot de passe incorrect"] },
      });
    }

    if (!user?.isEmailVerified) {
      log.auth("Tentative de connexion avec email non vérifié", {
        userId: user.id,
        email,
        ip: req.ip,
      });

      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Email non vérifié",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { email: ["Email non vérifié"] },
      });
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;

    if (rememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
    } else {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
    }

    log.auth("Connexion réussie", {
      userId: user.id,
      email: user.email,
      ip: req.ip,
      rememberMe,
      sessionId: req.sessionID,
    });

    log.userAction("login", user.id, {
      ip: req.ip,
      rememberMe,
    });

    await updateLastLoginService(user.id);
    await updateLastActivityService(user.id);

    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      return success(
        res,
        {
          user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
          },
          rememberMe: !!rememberMe,
        },
        "Connexion réussie"
      );
    });
  } catch (error) {
    log.error("Erreur inattendue lors du login", {
      ip: req.ip,
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    log.userAction("logout", userId || "unknown", {
      ip: req.ip,
      sessionId: req.sessionID,
    });

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      return success(res, null, "Déconnexion réussie");
    });

    await updateLastActivityService(userId);

    log.auth("Déconnexion réussie", { userId, ip: req.ip });
  } catch (error) {
    log.error("Erreur inattendue lors du logout", {
      userId: req.session?.userId,
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

export const checkAuth = async (req, res) => {
  const userId = req.session?.userId;

  await updateLastActivityService(userId);

  if (!userId) {
    return error(res, {
      status: HTTP_STATUS_CODES.Unauthorized,
      message: "Non autorisé - session manquante",
      code: HTTP_STATUS_CODES.Unauthorized,
      errors: { general: ["Non autorisé - session manquante"] },
    });
  }

  const user = await findUserByIdService(userId);

  if (!user) {
    return error(res, {
      status: HTTP_STATUS_CODES.Unauthorized,
      message: "Utilisateur non trouvé",
      code: HTTP_STATUS_CODES.Unauthorized,
      errors: { general: ["Utilisateur non trouvé"] },
    });
  }

  return success(
    res,
    {
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        role: user.role,
      },
    },
    "Utilisateur authentifié"
  );
};
