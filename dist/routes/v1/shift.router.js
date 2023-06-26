"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shift_authuthration_1 = require("./../../middlewares/authuthrations/shift.authuthration");
const shift_controller_1 = require("./../../controllers/shifts/shift.controller");
const validate_1 = require("./../../middlewares/validate");
const enums_1 = require("./../../types/enums");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const acsses_1 = require("../../middlewares/acsses");
const subscription_1 = require("../../middlewares/subscription");
const shift_validators_1 = require("../../validators/shift.validators");
const router = (0, express_1.Router)();
router
    .route('')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post((0, validate_1.validator)(shift_validators_1.validateShift, 'post'), (0, shift_authuthration_1.AuthuthrationShift_Department)('shift'), shift_controller_1.addShift);
router
    .route('/:branch')
    .all(auth_1.AuthenticationMiddleware, (0, shift_authuthration_1.AuthuthrationShift_Department)('shift'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get(shift_controller_1.getAllShifts);
router
    .route('/:branch/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .get((0, shift_authuthration_1.AuthuthrationShift_Department)('shift'), shift_controller_1.getShift)
    .put((0, shift_authuthration_1.AuthuthrationShift_Department)('shift'), (0, validate_1.validator)(shift_validators_1.validateShift, 'put'), shift_controller_1.updateShift)
    .delete(shift_controller_1.deleteShift);
router
    .route('holidays/:branch/:id')
    .all(auth_1.AuthenticationMiddleware, (0, shift_authuthration_1.AuthuthrationShift_Department)('shift'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post(shift_controller_1.addHolidays);
router
    .route('workdays/:branch/:id')
    .all(auth_1.AuthenticationMiddleware, (0, shift_authuthration_1.AuthuthrationShift_Department)('shift'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post(shift_controller_1.addWorkDays);
exports.default = router;
