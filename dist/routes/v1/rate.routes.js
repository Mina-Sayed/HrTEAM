"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rate_controller_1 = require("./../../controllers/rate.controller");
const auth_1 = require("./../../middlewares/auth");
const enums_1 = require("./../../types/enums");
const acsses_1 = require("./../../middlewares/acsses");
const express_1 = require("express");
const router = (0, express_1.Router)();
router
    .route('/:userId')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE))
    .get(rate_controller_1.rateSincecontract);
router
    .route('/month/:userId')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE))
    .get(rate_controller_1.getRateMonth);
router
    .route('/quarter/:userId')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE))
    .get(rate_controller_1.qurterRate);
exports.default = router;
