"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_controller_1 = require("./../../controllers/request/request.controller");
const subscription_1 = require("./../../middlewares/subscription");
const auth_1 = require("../../middlewares/auth");
const acsses_1 = require("../../middlewares/acsses");
const express_1 = require("express");
const enums_1 = require("../../types/enums");
const validate_1 = require("../../middlewares/validate");
const request_controller_2 = require("../../controllers/request/request.controller");
const request_validator_1 = require("../../validators/request.validator");
const request_authuthration_1 = require("../../middlewares/authuthrations/request.authuthration");
const router = (0, express_1.Router)();
// all(AuthenticationMiddleware, AuthuthrationRequest('request'), checkRole(Roles.ROOT), validator())
// create Request
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get((0, request_authuthration_1.AuthuthrationRequest)('request', 'all'), request_controller_2.getAllRequests)
    .post((0, validate_1.validator)(request_validator_1.validateRequest, 'post'), (0, request_authuthration_1.AuthuthrationRequest)('request', 'post'), request_controller_2.addRequest);
router
    .route('/alerts')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get((0, request_authuthration_1.AuthuthrationRequest)('request', 'all'), request_controller_1.getAllAlerts);
router
    .route('/recevie')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get((0, request_authuthration_1.AuthuthrationRequest)('request', 'all'), request_controller_1.getAllReceive);
router
    .route('/send')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE))
    .get((0, request_authuthration_1.AuthuthrationRequest)('request', 'all'), request_controller_1.getAllSend);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, request_authuthration_1.AuthuthrationRequest)('request', 'get'))
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), request_controller_2.getRequestById)
    .put((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), request_controller_2.updateRequest)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), request_controller_2.deleteRequest);
exports.default = router;
