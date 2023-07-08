"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payrol_controller_1 = require("./../../controllers/payrol/payrol.controller");
const subscription_1 = require("./../../middlewares/subscription");
const enums_1 = require("./../../types/enums");
const acsses_1 = require("./../../middlewares/acsses");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const payrol_controller_2 = require("../../controllers/payrol/payrol.controller");
const router = (0, express_1.Router)();
router
    .route('/shift/:branch')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), subscription_1.checkSubscripe)
    .get(payrol_controller_2.getAllPayRols);
router
    .route('/shift/employee')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.EMPLOYEE), subscription_1.checkSubscripe)
    .get(payrol_controller_1.getPayrolEmployee);
router
    .route('/department')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.EMPLOYEE, enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .get(payrol_controller_1.getPayrollsbyDepartment);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.EMPLOYEE, enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .get(payrol_controller_2.getPayrolById);
router.route('/yearly/:userId').
    get(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE, enums_1.Roles.ROOT), payrol_controller_1.getOneYearOfUserPayrol);
exports.default = router;
