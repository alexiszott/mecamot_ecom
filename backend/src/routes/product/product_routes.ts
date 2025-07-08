import { Router } from "express";
import {
  createProduct,
  archiveProduct,
  archiveProducts,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "./product_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  validateQuery,
  validateParams,
  validateBody,
} from "../../middleware/query_validation.js";
import {
  productQuerySchema,
  idParamsSchema,
  productBodySchema,
} from "../../utils/validate_schema.js";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Liste paginée des produits
 *     description: Récupère la liste des produits avec filtres et pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filtrer par marque
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum
 *       - in: query
 *         name: stockFilter
 *         schema:
 *           type: string
 *           enum: [all, in_stock, out_of_stock]
 *           default: all
 *         description: Filtrer par stock
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt, stock]
 *           default: createdAt
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description: Paramètres de requête invalides
 */
router.get("/", validateQuery(productQuerySchema), fetchProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Détails d'un produit
 *     description: Récupère les détails d'un produit spécifique par son slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug du produit
 *     responses:
 *       200:
 *         description: Détails du produit
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 */
router.get("/:slug", validateQuery(productQuerySchema), fetchProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Créer un produit
 *     description: Crée un nouveau produit (Admin uniquement)
 *     tags: [Products]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tondeuse électrique 1800W"
 *               description:
 *                 type: string
 *                 example: "Tondeuse électrique puissante pour jardin"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 299.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               brand:
 *                 type: string
 *                 example: "GreenPower"
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(productBodySchema),
  createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Modifier un produit
 *     description: Met à jour un produit existant (Admin uniquement)
 *     tags: [Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               brand:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Produit non trouvé
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(productBodySchema),
  updateProduct
);

/**
 * @swagger
 * /products/{id}/archive:
 *   put:
 *     summary: Archiver un produit
 *     description: Archive un produit spécifique (Admin uniquement)
 *     tags: [Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit archivé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Produit non trouvé
 */
router.put(
  "/:id/archive",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  archiveProduct
);

/**
 * @swagger
 * /products/archive:
 *   patch:
 *     summary: Archiver plusieurs produits
 *     description: Archive plusieurs produits en lot (Admin uniquement)
 *     tags: [Products]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
 *     responses:
 *       200:
 *         description: Produits archivés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.patch("/archive", requireAuth, requireAdmin, archiveProducts);

export default router;
