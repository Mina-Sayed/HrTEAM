"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subCategory_authuthration_1 = require("./../../middlewares/authuthrations/subCategory.authuthration");
const express_1 = require("express");
const acsses_1 = require("../../middlewares/acsses");
const validate_1 = require("../../middlewares/validate");
const auth_1 = require("../../middlewares/auth");
const enums_1 = require("../../types/enums");
const subCategory_controller_1 = require("../../controllers/subCategory/subCategory.controller");
const subcategory_validator_1 = require("../../validators/subcategory.validator");
// .all(AuthenticationMiddleware, AuthuthrationSubCategory('subCategory'), checkSubscripe, checkRole(Roles.ROOT))
const router = (0, express_1.Router)();
router.route('/')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.SUPER_ADMIN, enums_1.Roles.ROOT), (0, subCategory_authuthration_1.AuthuthrationSubCategory)('subCategory'))
    .post((0, validate_1.validator)(subcategory_validator_1.validateSubCategory, "post"), subCategory_controller_1.AddSubCategory);
router.route('/:id').all(auth_1.AuthenticationMiddleware, (0, subCategory_authuthration_1.AuthuthrationSubCategory)('subCategory'), (0, subCategory_authuthration_1.AuthuthrationSubCategory)('subCategory'))
    .get((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.SUPER_ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), subCategory_controller_1.getSubCategory)
    .put((0, validate_1.validator)(subcategory_validator_1.validateSubCategory, "put"), subCategory_controller_1.updateSubCategory)
    .delete(subCategory_controller_1.deleteSubCategory);
router.route('/all/:categoryId')
    .all(auth_1.AuthenticationMiddleware, (0, subCategory_authuthration_1.AuthuthrationSubCategory)('subCategory'), (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.SUPER_ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE))
    .get(subCategory_controller_1.getAllSubCategories);
exports.default = router;
