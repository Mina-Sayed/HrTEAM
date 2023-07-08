"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const break_overTime_authuthration_1 = require("./../../middlewares/authuthrations/break_overTime.authuthration");
const break_controller_1 = require("../../controllers/break/break.controller");
const break_controller_2 = require("../../controllers/break/break.controller");
const enums_1 = require("../../types/enums");
const acsses_1 = require("../../middlewares/acsses");
const subscription_1 = require("../../middlewares/subscription");
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const break_validator_1 = require("../../validators/break.validator");
const router = (0, express_1.Router)();
// Add a new break
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('break'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post((0, validate_1.validator)(break_validator_1.validateBreak, 'post'), break_controller_2.addBreak);
// Get all breaks in shift
router
    .route('/:shift')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('break'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get(break_controller_2.getAllBreaks);
// (GET , PUT , DELETE) break by ID break
router
    .route('/:shift/:id')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('break'), subscription_1.checkSubscripe)
    .put((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), (0, validate_1.validator)(break_validator_1.validateBreak, 'put'), break_controller_1.updateBreak)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), break_controller_1.getBreakById)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), break_controller_2.deleteBreakById);
// assign user to break by shift and id break and userId in Body
router
    .route('/assignUser/:shift/:id')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('break'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post(break_controller_2.assignUser);
// unassign user from break by shift and id break and userId in Body
router
    .route('/unassign/:shift/:id')
    .all(auth_1.AuthenticationMiddleware, (0, break_overTime_authuthration_1.AuthuthrationBreakOver)('break'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post(break_controller_2.unassignUser);
exports.default = router;
