import { Router } from "express";
import {
  fetchUser,
  fetchUsers,
  deleteUser,
  updateUser,
} from "./user_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/query_validation.js";
import {
  idParamsSchema,
  paginationSchema,
  updateUserSchema,
} from "../../utils/validate_schema.js";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste paginée des utilisateurs
 *     description: Récupère la liste des utilisateurs avec pagination (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
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
 *         description: Recherche par nom, prénom ou email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN]
 *         description: Filtrer par rôle
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [firstname, lastname, email, createdAt]
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
 *         description: Liste des utilisateurs
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
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */

router.get(
  "/",
  requireAuth,
  requireAdmin,
  validateQuery(paginationSchema),
  fetchUsers
);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     description: Récupère les détails d'un utilisateur spécifique (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Utilisateur non trouvé
 */

router.get(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  fetchUser
);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Modifier un utilisateur
 *     description: Met à jour les informations d'un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Jean
 *               lastname:
 *                 type: string
 *                 example: Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.dupont@example.com
 *               phone:
 *                 type: string
 *                 example: "+33123456789"
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 example: USER
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(updateUserSchema),
  updateUser
);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Supprimer un utilisateur
 *     description: Supprime définitivement un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put(
  "/:userId",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  deleteUser
);

export default router;
