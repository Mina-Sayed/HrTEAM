"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptions_1 = require("../../controllers/subscriptions");
const acsses_1 = require("../../middlewares/acsses");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const enums_1 = require("../../types/enums");
const packageValidator_1 = __importDefault(require("../../validators/packageValidator"));
const subscriptionsRouter = (0, express_1.Router)();
subscriptionsRouter.route('/').all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN))
    .get(subscriptions_1.getAllsubscriptions)
    .post((0, validate_1.validator)(packageValidator_1.default, "post"), subscriptions_1.createSubscription);
subscriptionsRouter.route('/updates/:id')
    .all(auth_1.AuthenticationMiddleware)
    .get((0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN, enums_1.Roles.ROOT), subscriptions_1.getSubscriptionById)
    .put((0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN), (0, validate_1.validator)(packageValidator_1.default, "put"), subscriptions_1.updateSubscription)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN), subscriptions_1.deleteSubscription)
    .post((0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN, enums_1.Roles.ROOT), subscriptions_1.activateSubscription);
subscriptionsRouter.route('/buy').post(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.USER), subscriptions_1.buySubscription);
subscriptionsRouter.route('/getSubscriptionByUser').get(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT), subscriptions_1.getUserSubscriptions);
exports.default = subscriptionsRouter;
