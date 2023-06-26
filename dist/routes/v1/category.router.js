"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./../../middlewares/validate");
const enums_1 = require("./../../types/enums");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const acsses_1 = require("../../middlewares/acsses");
const subscription_1 = require("../../middlewares/subscription");
const category_authuthration_1 = require("../../middlewares/authuthrations/category.authuthration");
const category_controller_1 = require("../../controllers/category/category.controller");
const category_validtor_1 = require("../../validators/category.validtor");
const router = (0, express_1.Router)();
// .all(AuthenticationMiddleware, AuthuthrationCategory('subCategory'), checkSubscripe, checkRole(Roles.ROOT))
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .post((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.SUPER_ADMIN), (0, validate_1.validator)(category_validtor_1.validateCategory, 'post'), (0, category_authuthration_1.AuthuthrationCategory)('category', 'post'), category_controller_1.addCategory)
    .get((0, category_authuthration_1.AuthuthrationCategory)('category', 'get'), (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.SUPER_ADMIN, enums_1.Roles.EMPLOYEE), category_controller_1.getAllCategory);
router.route('/');
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.SUPER_ADMIN))
    .get((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.SUPER_ADMIN, enums_1.Roles.EMPLOYEE), (0, category_authuthration_1.AuthuthrationCategory)('category', 'get'), category_controller_1.getCategoryById)
    .put((0, category_authuthration_1.AuthuthrationCategory)('category', 'put'), category_controller_1.UpdateCategory)
    .delete((0, category_authuthration_1.AuthuthrationCategory)('category', 'delete'), category_controller_1.DeleteCategory);
exports.default = router;
