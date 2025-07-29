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
    .toUpperCase()
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

// Schema pour valider les données de commande côté client - VERSION AMÉLIORÉE
export const orderBodySchema = z.object({
  userId: z.string().cuid("ID utilisateur invalide").optional(),

  shippingAddress: z
    .string()
    .min(5, {
      message: "L'adresse de livraison doit contenir au moins 5 caractères.",
    })
    .max(200, {
      message: "L'adresse de livraison ne peut pas dépasser 200 caractères.",
    })
    .trim(),

  shippingCity: z
    .string()
    .min(2, {
      message: "La ville de livraison doit contenir au moins 2 caractères.",
    })
    .max(100, {
      message: "La ville de livraison ne peut pas dépasser 100 caractères.",
    })
    .trim(),

  shippingPostalCode: z
    .string()
    .min(3, {
      message: "Le code postal doit contenir au moins 3 caractères.",
    })
    .max(20, {
      message: "Le code postal ne peut pas dépasser 20 caractères.",
    })
    .regex(/^[A-Z0-9\s\-]+$/i, {
      message: "Le code postal contient des caractères invalides.",
    })
    .trim(),

  shippingCountry: z
    .string()
    .min(2, {
      message: "Le pays de livraison doit contenir au moins 2 caractères.",
    })
    .max(100, {
      message: "Le pays de livraison ne peut pas dépasser 100 caractères.",
    })
    .trim(),

  shippingPhone: z
    .string()
    .min(8, {
      message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
    })
    .max(20, {
      message: "Le numéro de téléphone ne peut pas dépasser 20 caractères.",
    })
    .regex(/^[\+]?[0-9\s\-\(\)\.]+$/, {
      message: "Le numéro de téléphone contient des caractères invalides.",
    })
    .trim(),

  recipientName: z
    .string()
    .min(2, {
      message: "Le nom du destinataire doit contenir au moins 2 caractères.",
    })
    .max(100, {
      message: "Le nom du destinataire ne peut pas dépasser 100 caractères.",
    })
    .trim(),

  cartItems: z
    .array(
      z.object({
        productId: z.string().cuid("ID de produit invalide"),
        quantity: z
          .number()
          .int("La quantité doit être un nombre entier.")
          .min(1, { message: "La quantité doit être au moins 1." })
          .max(9999, { message: "La quantité ne peut pas dépasser 9999." }),
      })
    )
    .min(1, { message: "Au moins un produit est requis." })
    .max(50, { message: "Maximum 50 produits par commande." }),

  deliveryMethod: z
    .enum(["STANDARD", "EXPRESS", "PICKUP"], {
      message: "Méthode de livraison invalide.",
    })
    .optional(),

  notes: z
    .string()
    .max(500, {
      message: "Les notes ne peuvent pas dépasser 500 caractères.",
    })
    .trim()
    .optional(),
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

export const idParamsSchema = z.object({
  id: z
    .string()
    .min(1, "ID requis")
    .max(100, "ID trop long")
    .cuid("ID invalide"),
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

  category: z
    .string()
    .min(1, { message: "La catégorie est requise." })
    .max(50, { message: "La catégorie ne peut pas dépasser 50 caractères." })
    .transform((str) => str?.trim()),

  isPublished: z.boolean().optional().default(false),
});

export const categoryBodySchema = z.object({
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
    .trim(),

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

export const orderInternalSchema = z.object({
  userId: z.string().cuid("ID utilisateur invalide"),
  subtotal: z.number().min(0, "Le sous-total doit être positif"),
  shippingPrice: z.number().min(0, "Le prix de livraison doit être positif"),
  totalPrice: z.number().min(0, "Le prix total doit être positif"),
  taxPrice: z.number().min(0, "Le prix des taxes doit être positif"),
  totalWeight: z.number().min(0, "Le poids total doit être positif").optional(),

  shippingAddress: z.string().min(5).max(200),
  shippingCity: z.string().min(2).max(100),
  shippingPostalCode: z.string().min(3).max(20),
  shippingCountry: z.string().min(2).max(100),
  shippingPhone: z.string().min(8).max(20),
  recipientName: z.string().min(2).max(100),

  deliveryMethod: z.enum(["STANDARD", "EXPRESS", "PICKUP"]).optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED"]).default("PENDING"),
  status: z
    .enum([
      "PENDING",
      "PROCESSING",
      "PREPARING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "FAILED",
      "COMPLETED",
    ])
    .default("PENDING"),

  notes: z.string().max(500).optional(),

  orderItems: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().min(1).max(9999),
        price: z.number().min(0),
        totalWeight: z.number().min(0).optional(),
      })
    )
    .min(1),
});

export const cartItemValidationSchema = z.object({
  productId: z.string().cuid("ID de produit invalide"),
  quantity: z.number().int().min(1).max(9999),
});

export const orderUpdateSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "PROCESSING",
      "PREPARING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "FAILED",
      "COMPLETED",
    ])
    .optional(),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
  trackingNumber: z.string().max(100).optional(),
  trackingUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
  deliveryMethod: z.enum(["STANDARD", "EXPRESS", "PICKUP"]).optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
});
