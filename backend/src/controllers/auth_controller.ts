import {
  isUserExist,
  createUser,
  findUserByEmail,
} from "../services/auth_service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit faire au minimum 8 caractères." })
    .max(100, {
      message: "Le mot de passe ne peux pas faire plus de 100 caractères.",
    })
    .regex(/[a-zA-Z]/, { message: "Doit contenir au moins 1 lettre." })
    .regex(/[0-9]/, { message: "Doit contenir au moins 1 nombres" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Doit contenir au moins 1 caractère spécial.",
    })
    .trim(),
  firstname: z
    .string()
    .min(2, { message: "Le prénom doit faire plus de 2 caractères." })
    .max(50, { message: "Le pénom ne peux pas faire plus de 50 caractères." })
    .optional()
    .transform((str) => str?.trim()),
  lastname: z
    .string()
    .min(2, { message: "Le nom de famille doit faire plus de 2 caractères." })
    .max(50, {
      message: "Le nom de famille ne peux pas faire plus de 50 caractères.",
    })
    .optional()
    .transform((str) => str?.trim()),
});

export const register = async (req, res) => {
  const result = registerSchema.safeParse({
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const { email, password, firstname, lastname } = result.data;

    await isUserExist(email);

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUser(
      email,
      hashed,
      firstname ?? "",
      lastname ?? ""
    );

    const response = {
      message: "Utilisateur créé avec succès",
      user: { id: user.id, email: user.email },
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Erreur lors de l'inscription",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    console.log("🔑 Création du token JWT...");
    const jwtSecret = process.env.JWT_SECRET || "test-secret-key";
    console.log("JWT Secret utilisé:", jwtSecret.substring(0, 5) + "...");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    console.log("✅ Token JWT créé");

    const response = {
      message: "Utilisateur créé avec succès",
      token,
      user: { id: user.id, email: user.email },
    };

    console.log("📤 Envoi de la réponse:", response);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

export const me = async (req, res) => {
  const response = {
    message: "C'est moi ! 🕵️‍♂️",
  };
  res.status(200).json(response);
};
