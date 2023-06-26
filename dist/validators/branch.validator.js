"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBranch = void 0;
const joi_1 = __importDefault(require("joi"));
function validateBranch(branch) {
    const shiftSchema = joi_1.default.object({
        start_h: joi_1.default.number().min(0).max(23).required(),
        start_mins: joi_1.default.number().min(0).max(59).default(0),
        end_h: joi_1.default.number().min(0).max(23).required()
            .when('start_h', {
            is: joi_1.default.number(),
            then: joi_1.default.number().greater(joi_1.default.ref('start_h'))
        }),
        end_mins: joi_1.default.number().min(0).max(59).default(0),
    });
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(255).required(),
        company: joi_1.default.object().alter({
            post: (schema) => schema.required(),
        }),
        // shifts: Joi.array().items({
        //     work: shiftSchema,
        //     breaks: Joi.array().items(shiftSchema),
        //     overtimes: Joi.array().items(shiftSchema),
        // }),
        fixedHolidays: joi_1.default.array().items(joi_1.default.date()),
        lat: joi_1.default.number().alter({
            post: (schema) => schema.required(),
        }),
        long: joi_1.default.number().alter({
            post: (schema) => schema.required(),
        })
    });
    const result = schema.validate(branch);
    return result;
}
exports.validateBranch = validateBranch;
;
