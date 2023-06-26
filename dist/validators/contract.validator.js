"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const ContractValidation = (contract, typeReq) => {
    const validationSchema = joi_1.default.object({
        employee: joi_1.default.object().required(),
        bankAccount: joi_1.default.object().keys({
            accountName: joi_1.default.string(),
            accountNumber: joi_1.default.number(),
            balance: joi_1.default.number(),
        }),
        branch: joi_1.default.object().required(),
        department: joi_1.default.object().required(),
        salary: joi_1.default.number().required(),
        duration: joi_1.default.number().required(),
        startDate: joi_1.default.date().required(),
        countryStay: joi_1.default.string().required(),
        durationStay: joi_1.default.number().when('countryStay', {
            is: joi_1.default.string().empty(joi_1.default.not('Saudi')),
            then: joi_1.default.number().required(),
            // otherwise: Joi.forbidden(),
        }),
        startStay: joi_1.default.date().when('countryStay', {
            is: joi_1.default.string().empty(joi_1.default.not('Saudi')),
            then: joi_1.default.date().required(),
            // otherwise: Joi.forbidden(),
        }),
        endStay: joi_1.default.date(),
    });
    const result = validationSchema.tailor(typeReq).validate(contract);
    return result;
};
exports.ContractValidation = ContractValidation;
