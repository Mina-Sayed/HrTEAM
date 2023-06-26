"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subTaskValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const subTaskValidation = (subTask) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        start: joi_1.default.date().required(),
        end: joi_1.default.date().required(),
        task: joi_1.default.object().required(),
        isAccepted: joi_1.default.boolean().required(),
        from: joi_1.default.object().required(),
        company: joi_1.default.object(),
        branch: joi_1.default.object()
    });
    const result = schema.validate(subTask);
    return result;
};
exports.subTaskValidation = subTaskValidation;
