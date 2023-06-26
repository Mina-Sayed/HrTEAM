"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDepartment = exports.Department = exports.departmentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const joi_1 = __importDefault(require("joi"));
exports.departmentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    branch: {
        type: mongodb_1.ObjectId,
        required: true,
        ref: 'Branches'
    },
    clicked: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
exports.Department = mongoose_1.default.model('Departments', exports.departmentSchema);
function validateDepartment(department) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(255).required(),
        branch: joi_1.default.object().required()
    });
    const result = schema.validate(department);
    return result;
}
exports.validateDepartment = validateDepartment;
