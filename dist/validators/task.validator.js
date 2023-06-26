"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const taskValidation = (task, reqType) => {
    const schema = joi_1.default.object({
        start: joi_1.default.date().alter({
            post: (schema) => schema.required(),
        }),
        end: joi_1.default.date().alter({
            post: (schema) => schema.required(),
        }),
        to: joi_1.default.array().items(joi_1.default.object().alter({
            post: (schema) => schema.required(),
        })),
        title: joi_1.default.string().alter({
            post: (schema) => schema.required(),
        }),
        description: joi_1.default.string().alter({
            post: (schema) => schema.required(),
        }),
        company: joi_1.default.object(),
        branch: joi_1.default.object(),
        status: joi_1.default.string().valid('in progress', 'completed')
    });
    return schema.tailor(reqType).validate(task);
};
exports.taskValidation = taskValidation;
