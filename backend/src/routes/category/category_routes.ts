import { Router } from "express";
import {
  archiveCategories,
  archiveCategory,
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
} from "./category_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  validateQuery,
  validateParams,
  validateBody,
} from "../../middleware/query_validation.js";
import {
  idParamsSchema,
  categoryBodySchema,
} from "../../utils/validate_schema.js";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Liste des catégories
 *     description: |
 *       Récupère la liste des catégories actives.
 *       - Si les paramètres `page` ou `limit` sont fournis, retourne une liste paginée
 *       - Sinon, retourne toutes les catégories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numéro de page (optionnel - active la pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre d'éléments par page (optionnel - active la pagination)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *           default: name
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - allOf:
 *                     - $ref: '#/components/schemas/ApiResponse'
 *                     - type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 *                       description: Réponse paginée (quand page/limit fournis)
 *                 - allOf:
 *                     - $ref: '#/components/schemas/ApiResponse'
 *                     - type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *                       description: Toutes les catégories (sans pagination)
 *             examples:
 *               with_pagination:
 *                 summary: Avec pagination
 *                 value:
 *                   success: true
 *                   message: "Categories récupérées avec succès"
 *                   data: []
 *                   pagination:
 *                     currentPage: 1
 *                     totalPages: 5
 *                     totalItems: 50
 *                     hasNextPage: true
 *                     hasPrevPage: false
 *               without_pagination:
 *                 summary: Sans pagination
 *                 value:
 *                   success: true
 *                   message: "Categories récupérées avec succès"
 *                   data: []
 */
router.get("/", fetchCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Détails d'une catégorie
 *     description: Récupère les détails d'une catégorie spécifique
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Catégorie non trouvée
 */
router.get("/:id", validateParams(idParamsSchema), fetchCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Créer une catégorie
 *     description: Crée une nouvelle catégorie (Admin uniquement)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jardinage"
 *               description:
 *                 type: string
 *                 example: "Outils et équipements pour le jardin"
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
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
  validateBody(categoryBodySchema),
  createCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Modifier une catégorie
 *     description: Met à jour une catégorie existante (Admin uniquement)
 *     tags: [Categories]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la catégorie
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
 *     responses:
 *       200:
 *         description: Catégorie modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Catégorie non trouvée
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(categoryBodySchema),
  updateCategory
);

/**
 * @swagger
 * /categories/{id}/archive:
 *   put:
 *     summary: Archiver une catégorie
 *     description: Archive une catégorie spécifique (Admin uniquement)
 *     tags: [Categories]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie archivée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Catégorie non trouvée
 */
router.put(
  "/:id/archive",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  archiveCategory
);

/**
 * @swagger
 * /categories/archive:
 *   patch:
 *     summary: Archiver plusieurs catégories
 *     description: Archive plusieurs catégories en lot (Admin uniquement)
 *     tags: [Categories]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
 *     responses:
 *       200:
 *         description: Catégories archivées avec succès
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
router.patch("/archive", requireAuth, requireAdmin, archiveCategories);

export default router;
