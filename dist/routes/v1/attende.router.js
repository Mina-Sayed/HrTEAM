"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attendenc_controller_1 = require("./../../controllers/attendenc.controller");
const subscription_1 = require("./../../middlewares/subscription");
const auth_1 = require("../../middlewares/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.route('/').all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe).post(attendenc_controller_1.attend);
router
    .route('/employee/attend')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get(attendenc_controller_1.getStatusAttendToday);
router
    .route('/employee/attends')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get(attendenc_controller_1.getAllAttendforEmployee);
router
    .route('/count')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get(attendenc_controller_1.getAllCountForEveryYear);
router
    .route('/attends')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get(attendenc_controller_1.getAllAttendforUsers);
exports.default = router;
