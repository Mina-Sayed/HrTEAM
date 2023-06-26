"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = require("./../../controllers/notifications/index.controller");
const subscription_1 = require("./../../middlewares/subscription");
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const index_controller_2 = require("../../controllers/notifications/index.controller");
const router = (0, express_1.Router)();
router
    .route('/employee')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get(index_controller_2.getNotifictionEmployee);
router
    .route('/admin')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get(index_controller_1.getNotifictionAdminRoot);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .put(index_controller_1.updateStatus);
exports.default = router;
