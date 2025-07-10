import { Router } from "express";

import { requireAuth } from "../../middleware/auth_middleware.js";
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
} from "./cart_controller.js";

const router = Router();

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Récupérer le panier utilisateur
 *     description: Récupère le contenu du panier de l'utilisateur connecté
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Contenu du panier
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
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/CartItem'
 *                         total:
 *                           type: number
 *                           format: decimal
 *                           description: Total du panier
 *                         itemCount:
 *                           type: integer
 *                           description: Nombre d'articles dans le panier
 *       401:
 *         description: Non authentifié
 */
router.get("/", requireAuth, fetchCart);

/**
 * @swagger
 * /carts/{id}/cart-add:
 *   post:
 *     summary: Ajouter un produit au panier
 *     description: Ajoute un produit au panier de l'utilisateur connecté
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du produit à ajouter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *                 description: Quantité à ajouter
 *     responses:
 *       200:
 *         description: Produit ajouté au panier avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Données invalides ou stock insuffisant
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Produit non trouvé
 */
router.post("/items", requireAuth, addItemToCart);

/**
 * @swagger
 * /carts/{id}/cart-remove:
 *   post:
 *     summary: Retirer un produit du panier
 *     description: Retire un produit du panier de l'utilisateur connecté
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du produit à retirer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *                 description: Quantité à retirer (optionnel, retire tout si omis)
 *               removeAll:
 *                 type: boolean
 *                 example: false
 *                 description: Retirer complètement le produit du panier
 *     responses:
 *       200:
 *         description: Produit retiré du panier avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Produit non trouvé dans le panier
 */
router.post("/:id/cart-remove", requireAuth, removeItemFromCart);

export default router;
