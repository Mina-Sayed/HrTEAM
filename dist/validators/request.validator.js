"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (request) => {
    const schema = joi_1.default.object({
        title: joi_1.default.any(),
        subCategory: joi_1.default.any(),
        description: joi_1.default.string().required(),
        from: joi_1.default.object(),
        to: joi_1.default.object(),
        startDate: joi_1.default.date(),
        endDate: joi_1.default.date(),
        status: joi_1.default.boolean(),
        ids: joi_1.default.array()
    });
    return schema.validate(request);
};
exports.validateRequest = validateRequest;
