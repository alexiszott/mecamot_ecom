import { Router } from "express";
import {
  archiveCategory,
  createCategory,
  fetchCategories,
  fetchCategoriesPaginated,
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
  productQuerySchema,
  idParamsSchema,
  productBodySchema,
} from "../../utils/validate_schema.js";

const router = Router();

// Public routes

router.get("/", fetchCategories);
router.get("/paginated", fetchCategoriesPaginated);
router.get("/:id", validateQuery(productQuerySchema), fetchCategory);

// Protected routes

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(productBodySchema),
  createCategory
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(productBodySchema),
  updateCategory
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  archiveCategory
);

export default router;
