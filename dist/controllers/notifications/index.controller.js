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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getNotifictionAdminRoot = exports.getNotifictionEmployee = void 0;
const notification_model_1 = require("./../../models/notification.model");
const getNotifictionEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const getAllUnRead = yield notification_model_1.Notification.find({
        employee: user._id,
        isSeen: false,
    }).populate([
        { path: 'employee', model: 'User' }
    ]);
    const getAllSeen = yield notification_model_1.Notification.find({
        employee: user._id,
        isSeen: true,
    }).populate([
        { path: 'employee', model: 'User' }
    ]);
    if (!getAllUnRead[0] && !getAllSeen[0])
        return res
            .status(400)
            .send({
            error_en: "you don't have any notifictions yet",
            error_ar: 'لا تمتللك اشعارت حتي الان',
        });
    return res.send({
        seen: getAllSeen,
        unSeen: getAllUnRead,
        count: getAllUnRead.length,
        success: true,
    });
});
exports.getNotifictionEmployee = getNotifictionEmployee;
const getNotifictionAdminRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const getAllUnRead = yield notification_model_1.Notification.find({
        to: user._id,
        isSeen: false,
    }).populate([
        { path: 'employee', model: 'User' }
    ]);
    const getAllSeen = yield notification_model_1.Notification.find({
        to: user._id,
        isSeen: !false,
    }).populate([
        { path: 'employee', model: 'User' }
    ]);
    if (!getAllUnRead[0] && !getAllSeen[0])
        return res
            .status(400)
            .send({ error_en: "you don't have any notifictions yet", error_ar: "لا تمتللك اشعارت حتي الان" });
    return res.send({
        seen: getAllSeen,
        unSeen: getAllUnRead,
        count: getAllUnRead.length,
        success: true,
    });
});
exports.getNotifictionAdminRoot = getNotifictionAdminRoot;
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const notification = yield notification_model_1.Notification.findOne({ _id: req.params.id });
    if (!notification)
        return res.status(400).send({ erorr_en: 'Invalid Notification' });
    yield notification_model_1.Notification.updateOne({ _id: req.params.id }, {
        $set: {
            isSeen: true,
        },
    });
    const getAllUnRead = yield notification_model_1.Notification.find({
        to: user._id,
        isSeen: false,
    });
    const getAllSeen = yield notification_model_1.Notification.find({
        to: user._id,
        isSeen: !false,
    });
    res.send({
        seen: getAllSeen,
        unSeen: getAllUnRead,
        count: getAllUnRead.length,
        success: true,
    });
});
exports.updateStatus = updateStatus;
