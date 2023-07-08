"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const SubscriptionSchema = new mongoose_1.Schema({
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: Date,
    subscriber: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    package: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Package'
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    paid_SR: Number,
    paid_USD: Number,
    companiesAllowed: Number,
    employeesAllowed: Number
});
SubscriptionSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isNew)
            return next();
        const { price_SR, price_USD, duration, sale, maxCompaniesAllowed, maxEmployeesAllowed } = (yield this.populate('package', 'duration price_SR price_USD sale maxCompaniesAllowed maxEmployeesAllowed')).package;
        this.endDate = new Date(new Date(this.startDate).setMonth(new Date(this.startDate).getMonth() + duration));
        this.paid_SR = price_SR - sale * price_SR / 100;
        this.paid_USD = price_USD - sale * price_USD / 100;
        this.companiesAllowed = maxCompaniesAllowed;
        this.employeesAllowed = maxEmployeesAllowed;
        next();
    });
});
const Subscription = (0, mongoose_1.model)('Subscription', SubscriptionSchema);
exports.default = Subscription;
