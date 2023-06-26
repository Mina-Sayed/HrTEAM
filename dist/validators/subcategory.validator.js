"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubCategory = void 0;
const joi_1 = __importDefault(require("joi"));
function validateSubCategory(subCategory) {
    // check the truthness of have time 
    // const haveTime = subCategory.haveTime;
    const schema = joi_1.default.object({
        subType: joi_1.default.string().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        haveTime: joi_1.default.boolean().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        category: joi_1.default.object().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    });
    return schema.validate(subCategory);
}
exports.validateSubCategory = validateSubCategory;
