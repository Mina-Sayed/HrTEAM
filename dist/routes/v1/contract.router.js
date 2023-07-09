"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_authuthration_1 = require("./../../middlewares/authuthrations/contract.authuthration");
const subscription_1 = require("./../../middlewares/subscription");
const enums_1 = require("./../../types/enums");
const acsses_1 = require("./../../middlewares/acsses");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const contract_controller_1 = require("../../controllers/contract/contract.controller");
const validate_1 = require("../../middlewares/validate");
const contract_validator_1 = require("../../validators/contract.validator");
const router = (0, express_1.Router)();
router.route('/getContractByUser/:userId?').get(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE, enums_1.Roles.ROOT), contract_controller_1.getUserContract);
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), subscription_1.checkSubscripe)
    .post((0, validate_1.validator)(contract_validator_1.ContractValidation, 'post'), (0, contract_authuthration_1.AuthuthrationContract)('contract', 'post'), contract_controller_1.addContract);
router
    .route('/all/filter/:company')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), subscription_1.checkSubscripe)
    .get((0, contract_authuthration_1.AuthuthrationContract)('contract', 'get'), contract_controller_1.toggelGetContract);
router
    .route('/all/:company')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), subscription_1.checkSubscripe)
    .get((0, contract_authuthration_1.AuthuthrationContract)('contract', 'get'), contract_controller_1.getAllContract);
// a7a ya abdo you made the user to delete his contract
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), (0, contract_authuthration_1.AuthuthrationContract)('contract', 'get'), contract_controller_1.getContractById)
    .put((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), (0, validate_1.validator)(contract_validator_1.ContractValidation, 'put'), (0, contract_authuthration_1.AuthuthrationContract)('contract', 'put'), contract_controller_1.updateContract)
    .delete((0, contract_authuthration_1.AuthuthrationContract)('contract', 'delete'), (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), contract_controller_1.deleteContract);
exports.default = router;
