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
exports.Branch = exports.branchSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongodb_1 = require("mongodb");
// const { days } = require('../data/enums');
// const { BranchShift } = require('./DayShift');
exports.branchSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    location: {
        lat: Number,
        long: Number
    },
    company: {
        type: mongodb_1.ObjectId,
        required: true,
        ref: 'Company'
    },
    fixedHolidays: [Date],
    clicked: {
        type: Number,
        default: 0
    },
    emp: Array,
    deps: Array,
}, { timestamps: true });
exports.Branch = mongoose_1.default.model("Branches", exports.branchSchema);
