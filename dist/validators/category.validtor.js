"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategory = void 0;
const joi_1 = __importDefault(require("joi"));
function validateCategory(subCategory) {
    // check the truthness of have time 
    // const haveTime = subCategory.haveTime;
    const schema = joi_1.default.object({
        categoryType: joi_1.default.string().required(),
        company: joi_1.default.object()
    });
    return schema.validate(subCategory);
}
exports.validateCategory = validateCategory;
