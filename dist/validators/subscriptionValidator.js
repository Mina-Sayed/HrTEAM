"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateSubscription = (pack) => {
    const schema = joi_1.default.object({
        startDate: joi_1.default.date().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        subscriber: joi_1.default.objectId().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        package: joi_1.default.objectId().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    });
    const result = schema.validate(pack);
    return result;
};
exports.default = validateSubscription;
