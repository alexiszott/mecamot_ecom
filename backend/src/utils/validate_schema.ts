import { z } from "zod";

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." })
    .trim(),

  password: z
    .string()
    .min(8, {
      message: "Le mot de passe doit faire au moins 8 caractères de long.",
    })
    .max(100, {
      message: "Le mot de passe ne peut pas dépasser 100 caractères.",
    })
    .regex(/[a-z]/, {
      message: "Le mot de passe doit contenir au moins une lettre minuscule.",
    })
    .regex(/[A-Z]/, {
      message: "Le mot de passe doit contenir au moins une lettre majuscule.",
    })
    .regex(/[0-9]/, {
      message: "Le mot de passe doit contenir au moins un chiffre.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Le mot de passe doit contenir au moins un caractère spécial.",
    })
    .trim(),

  confirmPassword: z.string().trim(),

  firstname: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
    .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères." })
    .transform((str) => str?.trim()),

  lastname: z
    .string()
    .min(2, {
      message: "Le nom de famille doit contenir au moins 2 caractères.",
    })
    .max(50, {
      message: "Le nom de famille ne peut pas dépasser 50 caractères.",
    })
    .transform((str) => str?.trim()),

  // A MODIFIER PLUS TARD

  phone: z
    .string()
    .min(1, "Numéro requis")
    .transform((val, ctx) => validateAndFormat(val, ctx)),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." })
    .trim(),

  password: z.string().min(1, "Le mot de passe est requis"),

  rememberMe: z.boolean().optional().default(false),
});
