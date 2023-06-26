"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddCompany = exports.validateCompany = void 0;
const joi_1 = __importDefault(require("joi"));
function validateCompany(company) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(1).max(255).required(),
        owner: joi_1.default.object().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden()
        })
    });
    const result = schema.validate(company);
    return result;
}
exports.validateCompany = validateCompany;
function validateAddCompany(woner, companies) {
}
exports.validateAddCompany = validateAddCompany;
