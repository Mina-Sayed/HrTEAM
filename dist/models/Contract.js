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
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./../types/enums");
const mongodb_1 = require("mongodb");
const mongoose_1 = __importStar(require("mongoose"));
const ContractSchema = new mongoose_1.Schema({
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    branch: {
        type: mongodb_1.ObjectId,
        ref: "Branches"
    },
    department: {
        type: mongodb_1.ObjectId,
        ref: "Departments"
    },
    bankAccount: {
        accountName: { type: String },
        accountNumber: { type: Number },
        balance: { type: Number },
    },
    salary: { type: Number, required: true },
    dailySalary: Number,
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    countryStay: {
        type: String,
        enum: enums_1.nationalities
    },
    durationStay: Number,
    startStay: Date,
    endStay: Date,
}, { timestamps: true });
ContractSchema.methods.getDailySalary = function (salary, duration) {
    const mothlyDays = 30;
    return Number(salary / (duration * mothlyDays));
};
ContractSchema.methods.getEndDate = function (startDate, duration) {
    // what should we do next
    return new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + duration));
};
const Contract = mongoose_1.default.model('Contract', ContractSchema);
exports.default = Contract;
