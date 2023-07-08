"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paryrolValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const paryrolValidation = (payrol) => {
    const schema = joi_1.default.object({
        employee: joi_1.default.objectId().required(),
        day: joi_1.default.date().required(),
        dailySalary: joi_1.default.number().required(),
        originalTime: joi_1.default.number().required(),
        lateTime: joi_1.default.number().required(),
        type: joi_1.default.string().valid('shift', 'overtime')
    });
    return schema.validate(payrol);
};
exports.paryrolValidation = paryrolValidation;
