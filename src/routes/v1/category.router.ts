import { validator } from "../../middlewares/validator";
import { Roles } from "./../../types/enums";
import { authMiddleware } from "./../../middlewares/auth";
import { Router, Response, Request, NextFunction } from "express";
import { checkRole } from "../../middlewares/access";
import { checkSubscribe } from "../../middlewares/subscription";
import { authCategory } from "../../middlewares/authorization/category.authorization";
import {
    addCategory,
    getAllCategory,
    UpdateCategory,
    DeleteCategory,
    getCategoryById,
} from "../../controllers/category/category.controller";
import { validateCategory } from "../../validators/category.validtor";


const router: Router = Router();

// .all(AuthenticationMiddleware, AuthuthrationCategory('subCategory'), checkSubscripe, checkRole(Roles.ROOT))
router
    .route("/")
    .all(authMiddleware, checkSubscribe)
    .post(
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN),
        validator(validateCategory, "post"),
        authCategory("category", "post"),
        addCategory,
    )
    .get(
        authCategory("category", "get"),
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN, Roles.EMPLOYEE),
        getAllCategory,
    );
router.route("/");

router
    .route("/:id")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN),
    )
    .get(
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN, Roles.EMPLOYEE),
        authCategory("category", "get"),
        getCategoryById,
    )
    .put(authCategory("category", "put"), UpdateCategory)
    .delete(authCategory("category", "delete"), DeleteCategory);
export default router;
