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
const mongoose_1 = __importStar(require("mongoose"));
const mongodb_1 = require("mongodb");
const payrolSchema = new mongoose_1.Schema({
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    day: {
        type: Date,
        required: true,
    },
    dailySalary: {
        type: Number,
        required: true,
    },
    originalTime: {
        type: Number,
        required: true,
    },
    lateTime: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['shift', 'overtime'],
    },
    salary: {
        type: Number,
        required: true,
    },
    shift: {
        type: mongodb_1.ObjectId,
        ref: 'shift',
    },
    branch: {
        type: mongodb_1.ObjectId,
        ref: 'branches',
    },
    department: {
        type: mongodb_1.ObjectId,
        ref: 'departments',
    },
}, { timestamps: true });
const Payrol = mongoose_1.default.model('Payrol', payrolSchema);
payrolSchema.methods.calculateDailySalry = (originalTime, lateTime, salary) => {
    return Number(salary / (originalTime - lateTime));
};
exports.default = Payrol;
