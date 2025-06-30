import { z } from "zod";

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." })
    .max(100, {
      message: "L'email ne peut pas dépasser 100 caractères.",
    })
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

  confirmPassword: z.string().min(8).max(100).trim(),

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

  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." })
    .trim(),

  password: z.string().min(1, "Le mot de passe est requis"),

  rememberMe: z.boolean().optional().default(false),
});

export const idSchema = z.object({
  id: z
    .string()
    .min(1, "ID requis")
    .max(50, "ID trop long")
    .cuid("ID utilisateur invalide"),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 1, { message: "La page doit être supérieure à 0" }),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 1 && val <= 100, {
      message: "La limite doit être entre 1 et 100",
    }),

  skip: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .refine((val) => val === undefined || val >= 0, {
      message: "Skip doit être positif",
    }),
});

export const sortSchema = z.object({
  sortBy: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const allowedFields = [
          "name",
          "price",
          "createdAt",
          "updatedAt",
          "category",
          "brand",
        ];
        return allowedFields.includes(val);
      },
      { message: "Champ de tri non autorisé" }
    ),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const searchSchema = z.object({
  search: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return val.length >= 2 && val.length <= 100;
      },
      { message: "La recherche doit contenir entre 2 et 100 caractères" }
    ),
});

export const productFiltersSchema = z.object({
  category: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return val.length <= 50;
      },
      { message: "Catégorie invalide" }
    ),

  brand: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return val.length <= 50;
      },
      { message: "Marque invalide" }
    ),

  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || (val >= 0 && val <= 999999), {
      message: "Prix minimum invalide",
    }),

  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || (val >= 0 && val <= 999999), {
      message: "Prix maximum invalide",
    }),

  inStock: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.toLowerCase() === "true";
    }),
});

export const dateFiltersSchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date de début invalide" }
    )
    .transform((val) => (val ? new Date(val) : undefined)),

  endDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date de fin invalide" }
    )
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const updateUserSchema = z.object({
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

  phone: z.string().optional(),
});

export const productQuerySchema = paginationSchema
  .merge(sortSchema)
  .merge(searchSchema)
  .merge(productFiltersSchema)
  .merge(dateFiltersSchema)
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "Le prix minimum doit être inférieur ou égal au prix maximum",
      path: ["minPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "La date de début doit être antérieure à la date de fin",
      path: ["startDate"],
    }
  );

export const productParamsSchema = z.object({
  id: z.string().min(1, "ID requis").max(100, "ID trop long"),
});

export const productBodyArchiveSchema = z.object({
  ids: z
    .array(z.string())
    .min(1, "Au moins un ID est requis")
    .max(100, "Trop d'IDs, maximum 100")
    .transform((ids) => ids.map((id) => id.trim())),
});

export const productBodySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères." })
    .trim(),

  description: z
    .string()
    .max(500, {
      message: "La description ne peut pas dépasser 500 caractères.",
    })
    .trim()
    .optional(),

  price: z
    .string()
    .transform((val) => val.replace(",", "."))
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "Le prix doit être un nombre valide.",
    })
    .refine((val) => val >= 0, {
      message: "Le prix doit être supérieur ou égal à 0.",
    })
    .refine((val) => val <= 999999, {
      message: "Le prix ne peut pas dépasser 999999.",
    })
    .transform((val) => Number(val.toFixed(2))),

  stock: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Le stock doit être un nombre valide.",
    })
    .refine((val) => val >= 0, {
      message: "Le prix doit être supérieur ou égal à 0.",
    })
    .refine((val) => val <= 9999, {
      message: "Le prix ne peut pas dépasser 9999.",
    }),

  brand: z
    .string()
    .max(50, { message: "La marque ne peut pas dépasser 50 caractères." })
    .optional()
    .transform((str) => str?.trim()),

  images: z
    .array(
      z
        .string()
        .url({ message: "L'URL de l'image doit être valide." })
        .max(2000, {
          message: "L'URL de l'image ne peut pas dépasser 2000 caractères.",
        })
    )
    .optional(),

  isPublished: z.boolean().optional().default(false),
});

export const userQuerySchema = paginationSchema
  .merge(sortSchema)
  .merge(searchSchema)
  .merge(
    z.object({
      role: z.enum(["USER", "ADMIN"]).optional(),
      isEmailVerified: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          return val.toLowerCase() === "true";
        }),
    })
  )
  .merge(dateFiltersSchema);

// Schema pour les commandes
export const orderQuerySchema = paginationSchema
  .merge(sortSchema)
  .merge(searchSchema)
  .merge(
    z.object({
      status: z
        .enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"])
        .optional(),
      userId: z.string().optional(),
    })
  )
  .merge(dateFiltersSchema);
