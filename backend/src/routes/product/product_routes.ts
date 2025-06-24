import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "./product_controller.js";
import { requireAdmin } from "../../middleware/admin_middleware.js";
import { requireAuth } from "../../middleware/auth_middleware.js";

const router = Router();

// Public routes
router.get("/", fetchProducts);
router.get("/:slug", fetchProduct);

// Protected routes

router.post("/", requireAuth, requireAdmin, addProduct);
router.patch("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
