import { Router } from "express";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";
import { getProductStats, getUsersStats } from "./stats_controller.js";

const router = Router();

/**
 * @swagger
 * /stats/products-stats:
 *   get:
 *     summary: Statistiques des produits
 *     description: Récupère les statistiques détaillées des produits (Admin uniquement)
 *     tags: [Stats]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des produits
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalProducts:
 *                           type: integer
 *                           description: Nombre total de produits
 *                         activeProducts:
 *                           type: integer
 *                           description: Nombre de produits actifs
 *                         archivedProducts:
 *                           type: integer
 *                           description: Nombre de produits archivés
 *                         outOfStockProducts:
 *                           type: integer
 *                           description: Nombre de produits en rupture
 *                         lowStockProducts:
 *                           type: integer
 *                           description: Nombre de produits en stock faible
 *                         averagePrice:
 *                           type: number
 *                           format: decimal
 *                           description: Prix moyen des produits
 *                         totalValue:
 *                           type: number
 *                           format: decimal
 *                           description: Valeur totale du stock
 *                         categoriesStats:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               categoryName:
 *                                 type: string
 *                               productCount:
 *                                 type: integer
 *                               averagePrice:
 *                                 type: number
 *                                 format: decimal
 *                         recentProducts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get("/products-stats", requireAuth, requireAdmin, getProductStats);

/**
 * @swagger
 * /stats/users-stats:
 *   get:
 *     summary: Statistiques des utilisateurs
 *     description: Récupère les statistiques détaillées des utilisateurs (Admin uniquement)
 *     tags: [Stats]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: integer
 *                           description: Nombre total d'utilisateurs
 *                         activeUsers:
 *                           type: integer
 *                           description: Nombre d'utilisateurs actifs
 *                         verifiedUsers:
 *                           type: integer
 *                           description: Nombre d'utilisateurs vérifiés
 *                         unverifiedUsers:
 *                           type: integer
 *                           description: Nombre d'utilisateurs non vérifiés
 *                         adminUsers:
 *                           type: integer
 *                           description: Nombre d'administrateurs
 *                         regularUsers:
 *                           type: integer
 *                           description: Nombre d'utilisateurs réguliers
 *                         recentRegistrations:
 *                           type: integer
 *                           description: Nouvelles inscriptions (30 derniers jours)
 *                         userGrowth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               date:
 *                                 type: string
 *                                 format: date
 *                               count:
 *                                 type: integer
 *                           description: Évolution du nombre d'utilisateurs
 *                         recentUsers:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get("/users-stats", requireAuth, requireAdmin, getUsersStats);

export default router;
