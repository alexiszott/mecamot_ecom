import {
  isUserExistService,
  createUserService,
  findUserByEmailService,
  verifyUserService,
  sendVerifyTokenService,
  getTokenEntryService,
  deleteEmailVerificationTokenService,
} from "../services/auth_service.js";
import bcrypt from "bcrypt";
import { HTTP_STATUS_CODES } from "../http_status_code.js";
import { error, success } from "../utils/apiReponse.js";
import { loginSchema, registerSchema } from "../utils/validate_schema.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
  const result = registerSchema.safeParse({
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    confirmPassword: req.body.confirmPassword,
  });

  if (!result.success) {
    return error(res, {
      status: HTTP_STATUS_CODES.UnprocessableEntity,
      message: "Des champs sont invalides",
      code: HTTP_STATUS_CODES.UnprocessableEntity,
      errors: result.error.flatten().fieldErrors,
    });
  }

  if (result.data.password !== result.data.confirmPassword) {
    return error(res, {
      status: HTTP_STATUS_CODES.UnprocessableEntity,
      message: "Les mots de passe ne correspondent pas",
      code: HTTP_STATUS_CODES.UnprocessableEntity,
      errors: { confirmPassword: ["Les mots de passe ne correspondent pas"] },
    });
  }

  try {
    const { email, password, firstname, lastname, phone } = result.data;

    const exist = await isUserExistService(email);

    if (exist) {
      return error(res, {
        status: HTTP_STATUS_CODES.Conflict,
        message: "L'email est déjà utilisé",
        code: HTTP_STATUS_CODES.Conflict,
        errors: { email: ["Cet email est déjà utilisé"] },
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUserService(
      email,
      hashed,
      firstname ?? "",
      lastname ?? "",
      phone ?? ""
    );

    if (!user) {
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

    const url = `http://localhost:3001/api/auth/verify?token=${rawToken}`;
    console.log(`Envoyer un email à ${user.email} avec le lien : ${url}`);

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
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return error(res, {
        status: HTTP_STATUS_CODES.UnprocessableEntity,
        message: "Des champs sont invalides",
        code: HTTP_STATUS_CODES.UnprocessableEntity,
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password, rememberMe } = result.data;
    const user = await findUserByEmailService(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return error(res, {
        status: HTTP_STATUS_CODES.Unauthorized,
        message: "Email ou mot de passe incorrect",
        code: HTTP_STATUS_CODES.Unauthorized,
        errors: { email: ["Email ou mot de passe incorrect"] },
      });
    }

    // Check if email is verified
    if (!user?.isEmailVerified) {
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
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      return success(res, null, "Déconnexion réussie");
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = req.user;

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
          isEmailVerified: user.isEmailVerified,
        },
      },
      "Utilisateur authentifié"
    );
  } catch (error) {
    next(error);
  }
};
