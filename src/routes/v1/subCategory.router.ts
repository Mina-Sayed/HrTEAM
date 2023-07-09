import { AuthuthrationSubCategory } from './../../middlewares/authuthrations/subCategory.authuthration';
import { Router, Response, Request, NextFunction } from "express"
import { checkRole } from '../../middlewares/acsses';
import { validator } from "../../middlewares/validate";
import { checkSubscripe } from '../../middlewares/subscription';
import { AuthenticationMiddleware } from "../../middlewares/auth";
import { Roles } from "../../types/enums";
import { AddSubCategory, getSubCategory, updateSubCategory, deleteSubCategory, getAllSubCategories } from "../../controllers/subCategory/subCategory.controller";
import { validateSubCategory } from "../../validators/subcategory.validator";
// .all(AuthenticationMiddleware, AuthuthrationSubCategory('subCategory'), checkSubscripe, checkRole(Roles.ROOT))

const router: Router = Router();
router.route('/')
    .all(AuthenticationMiddleware, checkRole(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ROOT), AuthuthrationSubCategory('subCategory'))
    .post(validator(validateSubCategory, "post"), AddSubCategory)
router.route('/:id').all(AuthenticationMiddleware, AuthuthrationSubCategory('subCategory'), AuthuthrationSubCategory('subCategory'))
    .get(checkRole(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ROOT, Roles.EMPLOYEE), getSubCategory)
    .put(validator(validateSubCategory, "put"), updateSubCategory)
    .delete(deleteSubCategory)
router.route('/all/:categoryId')
    .all(AuthenticationMiddleware, AuthuthrationSubCategory('subCategory'), checkRole(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ROOT, Roles.EMPLOYEE))
    .get(getAllSubCategories)
export default router;