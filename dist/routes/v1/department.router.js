"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shift_authuthration_1 = require("./../../middlewares/authuthrations/shift.authuthration");
const department_controller_1 = require("./../../controllers/depatement/department.controller");
const validate_1 = require("./../../middlewares/validate");
const enums_1 = require("./../../types/enums");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const acsses_1 = require("../../middlewares/acsses");
const subscription_1 = require("../../middlewares/subscription");
const Department_1 = require("../../models/Department");
const router = (0, express_1.Router)();
// a7a ya abdo :: admin can add branch as well
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post((0, validate_1.validator)(Department_1.validateDepartment, 'post'), (0, shift_authuthration_1.AuthuthrationShift_Department)('departement'), department_controller_1.addDepartment);
router
    .route('/:branch')
    .all(auth_1.AuthenticationMiddleware, (0, shift_authuthration_1.AuthuthrationShift_Department)('departement'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get(department_controller_1.getAllDepartment);
// a7a ya abdo :: both root and admin have the same access to the company
router
    .route('/:branch/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get((0, shift_authuthration_1.AuthuthrationShift_Department)('departement'), (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), department_controller_1.getDepartment)
    .put((0, shift_authuthration_1.AuthuthrationShift_Department)('departement'), (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), (0, validate_1.validator)(Department_1.validateDepartment, 'put'), department_controller_1.updateDepartment)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), department_controller_1.delteDepartment);
exports.default = router;
