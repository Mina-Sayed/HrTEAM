"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validatePackage = (pack) => {
    const schema = joi_1.default.object({
        name_ar: joi_1.default.string().min(3).max(50).pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        name_en: joi_1.default.string().min(3).max(50).pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        duration: joi_1.default.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        sale: joi_1.default.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        maxCompaniesAllowed: joi_1.default.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        maxEmployeesAllowed: joi_1.default.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        price_SR: joi_1.default.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        price_USD: joi_1.default.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    });
    const result = schema.validate(pack);
    return result;
};
exports.default = validatePackage;
