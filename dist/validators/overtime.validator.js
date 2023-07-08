"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOvertime = void 0;
const joi_1 = __importDefault(require("joi"));
function validateOvertime(overtime) {
    const schema = joi_1.default.object({
        start: joi_1.default.date().greater('now').alter({
            post: (schema) => schema.required(),
        }),
        end: joi_1.default.date().alter({
            post: (schema) => schema.required(),
        }),
        shift: joi_1.default.object().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden()
        })
    });
    const result = schema.validate(overtime);
    return result;
}
exports.validateOvertime = validateOvertime;
;
