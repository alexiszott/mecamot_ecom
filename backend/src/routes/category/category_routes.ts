import { Router } from "express";
import {
  archiveCategories,
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
  idParamsSchema,
  categoryBodySchema,
} from "../../utils/validate_schema.js";

const router = Router();

// Public routes

router.get("/", fetchCategories);
router.get("/paginated", fetchCategoriesPaginated);
router.get("/:id", validateQuery(idParamsSchema), fetchCategory);

// Protected routes

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(categoryBodySchema),
  createCategory
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  validateBody(categoryBodySchema),
  updateCategory
);

router.put(
  "/:id/archive",
  requireAuth,
  requireAdmin,
  validateParams(idParamsSchema),
  archiveCategory
);

router.patch("/archive", requireAuth, requireAdmin, archiveCategories);

export default router;
