"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const mongoose_2 = require("mongoose");
const schema = new mongoose_2.Schema({
    isSeen: {
        type: Boolean,
        default: false,
    },
    company: {
        type: mongodb_1.ObjectId,
        ref: 'company',
    },
    to: {
        type: mongodb_1.ObjectId,
        ref: 'user',
    },
    employee: {
        type: mongodb_1.ObjectId,
        ref: 'user',
    },
    days: Number,
    des_en: {
        type: String,
    },
    type: String,
    des_ar: String,
    title_en: String,
    title_ar: String,
}, { timestamps: true });
exports.Notification = mongoose_1.default.model('notification', schema);
