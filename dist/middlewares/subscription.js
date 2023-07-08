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
exports.checkSubscripe = void 0;
const Company_1 = require("../models/Company");
const Subscription_1 = __importDefault(require("../models/Subscription"));
const enums_1 = require("../types/enums");
const checkSubscripe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let root;
    if (req.user._id && req.user.role === enums_1.Roles.ROOT) {
        root = req.user._id;
    }
    else if (req.user._id && req.user.role === enums_1.Roles.ADMIN) {
        let company = yield Company_1.Company.findOne({ _id: req.user.company });
        root = company.owner;
    }
    else if (req.user._id && req.user.role === enums_1.Roles.EMPLOYEE) {
        let company = yield Company_1.Company.findOne({ _id: req.user.company });
        root = company.owner;
    }
    let subscribe = yield Subscription_1.default.findOne({ subscriber: root });
    if (subscribe && (subscribe.endDate < new Date(Date.now()) || subscribe.isExpired))
        return res.status(403).send('Access Forbidden!! , your subscription is expired');
    next();
});
exports.checkSubscripe = checkSubscripe;
