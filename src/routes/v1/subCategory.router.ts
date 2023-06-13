import { authSubCategory } from "../../middlewares/authorization/subCategory.authorization";
import { Router } from "express";
import { checkRole } from "../../middlewares/access";
import { validator } from "../../middlewares/validator";
import { authMiddleware } from "../../middlewares/auth";
import { Roles } from "../../types/enums";
import {
  AddSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories,
} from "../../controllers/subCategory/subCategory.controller";
import { validateSubCategory } from "../../validators/subcategory.validator";
// .all(AuthenticationMiddleware, AuthuthrationSubCategory('subCategory'), checkSubscripe, checkRole(Roles.ROOT))

const router: Router = Router();
router.route("/")
  .all(authMiddleware, checkRole(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ROOT), authSubCategory("subCategory"))
  .post(validator(validateSubCategory, "post"), AddSubCategory);
router.route("/:id").all(authMiddleware, authSubCategory("subCategory"),
  authSubCategory("subCategory"))
  .get(checkRole(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ROOT, Roles.EMPLOYEE), getSubCategory)
  .put(validator(validateSubCategory, "put"), updateSubCategory)
  .delete(deleteSubCategory);
router.route("/all/:categoryId")
  .all(authMiddleware, authSubCategory("subCategory"),
    checkRole(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ROOT, Roles.EMPLOYEE))
  .get(getAllSubCategories);
export default router;