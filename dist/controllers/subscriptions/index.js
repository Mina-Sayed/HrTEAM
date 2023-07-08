"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateSubscription = exports.buySubscription = exports.getUserSubscriptions = exports.deleteSubscription = exports.updateSubscription = exports.createSubscription = exports.getSubscriptionById = exports.getAllsubscriptions = void 0;
const Subscription_1 = __importDefault(require("../../models/Subscription"));
const User_1 = __importDefault(require("../../models/User"));
const enums_1 = require("../../types/enums");
//@desc         get all subscription
//@route        GET /api/v1/subscriptions
//@access       private(super admin)
const getAllsubscriptions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allsubscriptions = yield Subscription_1.default.find({});
    res.send({
        success: true,
        data: allsubscriptions,
        message: 'subscription are fetched successfully'
    });
});
exports.getAllsubscriptions = getAllsubscriptions;
//@desc         get Subscription by id
//@route        GET /api/v1/subscriptions/:id
//@access       private(super admin, Root)
const getSubscriptionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.user!.role === Roles.ROOT && req.user!._id === req.params.id) return res.status(401).send({
    //     success: false,
    //     message: 'user not allowed',
    // });
    const SubscriptionFetched = yield Subscription_1.default.findOne({ subscriber: req.params.id });
    res.send({
        success: true,
        data: SubscriptionFetched,
        message: 'Subscription is fetched successfully'
    });
});
exports.getSubscriptionById = getSubscriptionById;
//@desc         create a subscription
//@route        POST /api/v1/subscriptions
//@access       private(super admin)
const createSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionCreated = yield Subscription_1.default.create(req.body);
    res.status(201).send({
        success: true,
        data: subscriptionCreated,
        message: 'Subscription is created successfully'
    });
});
exports.createSubscription = createSubscription;
//@desc         update a subscription
//@route        PATCH /api/v1/subscriptions/:id
//@access       private(super admin)
const updateSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionUpdated = yield Subscription_1.default.findByIdAndUpdate(req.params.id);
    res.send({
        success: true,
        data: subscriptionUpdated,
        message: 'subscription is updated successfully'
    });
});
exports.updateSubscription = updateSubscription;
//@desc         delete a Subscription
//@route        DELETE /api/v1/subscriptions/:id
//@access       private(super admin)
const deleteSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield Subscription_1.default.findByIdAndRemove(req.params.id);
    res.status(204).send({
        success: true,
        message: 'subscription is deleted successfully'
    });
});
exports.deleteSubscription = deleteSubscription;
//@desc         get subscribtion of a user
//@route        get /api/v1/subscriptions/user/:id
//@access       private(super admin, Root)
const getUserSubscriptions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userSubscriptions = yield Subscription_1.default.findOne({ subscriber: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).populate([
        { path: 'package', model: "Package" }
    ]);
    if (!userSubscriptions) {
        return res.status(400).send({ error_en: 'subscriptions Are Not Found ', error_ar: 'الاشتراكات غير موجودة' });
    }
    res.send({
        success: true,
        message: 'user subscriptions are fetched successfully',
        subscription: userSubscriptions
    });
});
exports.getUserSubscriptions = getUserSubscriptions;
//@desc         root subscribes to a package
//@route        POST /api/v1/subscriptions/user/:id
//@access       private(Root)
const buySubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    //EXTRA VALIDATE
    const subscripe = yield Subscription_1.default.findOne({ subscriber: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, isExpired: false });
    if (subscripe)
        return res.status(400).send({ error_en: "You already took a bouquet" });
    const userSubscriptions = new Subscription_1.default({
        subscriber: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
        package: req.body.package
    });
    yield User_1.default.updateOne({ _id: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id }, {
        $set: {
            role: "root"
        }
    });
    userSubscriptions.save();
    // Payment logic will be implemented here
    res.status(201).send({
        success: true,
        message: 'user subscribed to package',
        data: userSubscriptions
    });
});
exports.buySubscription = buySubscription;
//@desc         activate subscription
//@route        POST /api/v1/subscriptions/:id
//@access       private(super admin, Root)
const activateSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield Subscription_1.default.findById(req.params.id);
    // Not found subscription
    if (subscription === null)
        return res.status(404).send({
            success: false, message: 'subscription not found'
        });
    // not user's subscription
    if (req.user.role === enums_1.Roles.ROOT && req.user._id !== subscription.subscriber)
        return res.status(401).send({
            success: false,
            message: 'user not allowed',
        });
    // activate subscription
    subscription.isActive = true;
    yield subscription.save();
    // make the rest of user's subscriptions inactive
    yield Subscription_1.default.updateMany({ subscriber: req.user._id }, { $set: { isActive: false } });
    res.send({
        success: true,
        message: 'package is activated successfully',
        data: subscription
    });
});
exports.activateSubscription = activateSubscription;
