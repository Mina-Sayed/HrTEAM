"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const company_controller_1 = require("../../controllers/company/company.controller");
const validate_1 = require("../../middlewares/validate");
const company_validator_1 = require("../../validators/company.validator");
const acsses_1 = require("../../middlewares/acsses");
const enums_1 = require("../../types/enums");
const subscription_1 = require("../../middlewares/subscription");
const compnay_authuthration_1 = require("../../middlewares/authuthrations/compnay.authuthration");
const router = (0, express_1.Router)();
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT))
    .post((0, validate_1.validator)(company_validator_1.validateCompany, 'post'), company_controller_1.addCompany)
    .get((0, compnay_authuthration_1.AuthuthrationCompany)('company'), company_controller_1.getOwnerCompanies);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware)
    .put((0, compnay_authuthration_1.AuthuthrationCompany)('company'), subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, validate_1.validator)(company_validator_1.validateCompany, 'put'), company_controller_1.updateCompanyByName)
    .get((0, compnay_authuthration_1.AuthuthrationCompany)('company'), (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), company_controller_1.getCompanyByName).delete(company_controller_1.deleteCompanyById);
exports.default = router;
