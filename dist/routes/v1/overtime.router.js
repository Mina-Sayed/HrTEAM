"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const break_overTime_authuthration_1 = require("./../../middlewares/authuthrations/break_overTime.authuthration");
const overtime_controller_1 = require("../../controllers/overTime/overtime.controller");
const validate_1 = require("../../middlewares/validate");
const enums_1 = require("../../types/enums");
const acsses_1 = require("../../middlewares/acsses");
const subscription_1 = require("../../middlewares/subscription");
const auth_1 = require("../../middlewares/auth");
const express_1 = require("express");
const overtime_validator_1 = require("../../validators/overtime.validator");
const router = (0, express_1.Router)();
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('overtime'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post((0, validate_1.validator)(overtime_validator_1.validateOvertime, 'post'), overtime_controller_1.addOverTime);
router
    .route('/:shift')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('overtime'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get(overtime_controller_1.getAllOverTimeByShift);
// (GET , PUT , DELETE) overtime by ID overtime
router
    .route('/:shift/:id')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('overtime'), subscription_1.checkSubscripe)
    .put((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), (0, validate_1.validator)(overtime_validator_1.validateOvertime, 'put'), overtime_controller_1.updateOverTime)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), overtime_controller_1.getOverTimeById)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), overtime_controller_1.deleteOvertimeById);
// assign user to overTime by shift and id overtime and userId in Body
router
    .route('/assignUser/:shift/:id')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('overtime'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post(overtime_controller_1.assginUser);
// unassign user from overtime by shift and id overtime and userId in Body
router
    .route('/unassign/:shift/:id')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('overtime'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post(overtime_controller_1.unassignUser);
exports.default = router;
