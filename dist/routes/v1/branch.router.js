"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const branch_authuthration_1 = require("./../../middlewares/authuthrations/branch.authuthration");
const branch_controller_1 = require("./../../controllers/branch/branch.controller");
const validate_1 = require("./../../middlewares/validate");
const enums_1 = require("./../../types/enums");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const acsses_1 = require("../../middlewares/acsses");
const branch_validator_1 = require("../../validators/branch.validator");
const branch_controller_2 = require("../../controllers/branch/branch.controller");
const subscription_1 = require("../../middlewares/subscription");
const router = (0, express_1.Router)();
// a7a ya abdo : branch can be deleted by admin and root
router
    .route('/:company?')
    .all(auth_1.AuthenticationMiddleware, (0, branch_authuthration_1.AuthuthrationBranch)('branch'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN))
    .post((0, validate_1.validator)(branch_validator_1.validateBranch, 'post'), branch_controller_2.addBranch);
router
    .route('/:company')
    .all(auth_1.AuthenticationMiddleware, (0, branch_authuthration_1.AuthuthrationBranch)('branch'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get(branch_controller_1.getAllBranches);
router
    .route('/data/:company')
    .all(auth_1.AuthenticationMiddleware, (0, branch_authuthration_1.AuthuthrationBranch)('branch'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get(branch_controller_1.getAllBranchesWithData);
router
    .route('/:company/:id')
    .all(auth_1.AuthenticationMiddleware, (0, branch_authuthration_1.AuthuthrationBranch)('branch'), subscription_1.checkSubscripe)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE, enums_1.Roles.ADMIN), branch_controller_1.getBranch)
    .put((0, validate_1.validator)(branch_validator_1.validateBranch, 'put'), (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), branch_controller_1.updateBranch)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), branch_controller_1.deleteBranch);
exports.default = router;
