"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBreak = void 0;
const joi_1 = __importDefault(require("joi"));
const validateBreak = (breakTime, mode) => {
    const schema = joi_1.default.object({
        start: joi_1.default.when('isOpen', {
            is: joi_1.default.boolean().valid(false),
            then: joi_1.default.object({
                hours: joi_1.default.number().required().min(0).max(23),
                mins: joi_1.default.number().min(0).max(59),
            }).required(),
            otherwise: joi_1.default.forbidden(),
        }),
        end: joi_1.default.when('isOpen', {
            is: joi_1.default.boolean().valid(false),
            then: joi_1.default.object({
                hours: joi_1.default.number().required().min(0).max(23),
                mins: joi_1.default.number().required()
            }).required(),
            otherwise: joi_1.default.forbidden(),
        }),
        isOpen: joi_1.default.boolean(),
        duration: joi_1.default.when('isOpen', {
            is: joi_1.default.boolean().valid(true),
            then: joi_1.default.object({
                hours: joi_1.default.number().required().min(0).max(23),
                mins: joi_1.default.number().min(0).max(59),
            }).required(),
            otherwise: joi_1.default.forbidden(),
        }),
        shift: joi_1.default.object().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    });
    const result = schema.tailor(mode).validate(breakTime);
    return result;
};
exports.validateBreak = validateBreak;
