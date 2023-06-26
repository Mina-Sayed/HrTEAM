"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserPut = exports.validateUserPost = void 0;
const joi_1 = __importDefault(require("joi"));
const enums_1 = require("../types/enums");
// a7a ya abdo
const validateUserPost = (user, reqType) => {
    const schema = joi_1.default.object({
        fullName_ar: joi_1.default.string()
            .min(3)
            .max(50)
            .pattern(/^[\u0621-\u064A ]+$/),
        // .required(),,
        fullName_en: joi_1.default.string()
            .min(3)
            .max(50)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/)
        // .required(),
        ,
        userName_ar: joi_1.default.string()
            .min(3)
            .max(30)
            .pattern(/^[\u0621-\u064A0-9 ]+$/)
        // .required(),
        ,
        userName_en: joi_1.default.string()
            .min(3)
            .max(30)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/)
        // .required(),
        ,
        image: joi_1.default.string().alter({
            post: (schema) => schema.required(),
        }),
        email: joi_1.default.string().min(9).max(255).email().required(),
        password: joi_1.default.string().min(5).max(255).required(),
        phone: joi_1.default.string()
            .min(7)
            .max(15)
            .pattern(/^[0-9]+$/)
            .required(),
        company: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE, enums_1.Roles.ADMIN),
            then: joi_1.default.string().required(),
        }),
        phone2: joi_1.default.string()
            .min(7)
            .length(15)
            .pattern(/^[0-9]+$/),
        nationalId: joi_1.default.string().min(1).max(14),
        position: joi_1.default.string().min(2).max(255),
        branch: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE, enums_1.Roles.ADMIN),
            then: joi_1.default.object().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
        department: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE, enums_1.Roles.ADMIN),
            then: joi_1.default.object().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
        nationality: joi_1.default.string()
            .min(5)
            .max(255)
            .valid(...enums_1.nationalities),
        address: joi_1.default.string().min(10).max(200),
        city: joi_1.default.string().min(2).max(50),
        maritalStatus: joi_1.default.string()
            .min(4)
            .max(50)
            .valid(...Object.keys(enums_1.MartialStatusEnum)),
        residencyExpiration: joi_1.default.date().greater('now'),
        birthDate: joi_1.default.string().isoDate(),
        role: joi_1.default.string(),
        shift: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE, enums_1.Roles.ADMIN),
            then: joi_1.default.object().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
    });
    const result = schema.tailor(reqType).validate(user);
    return result;
};
exports.validateUserPost = validateUserPost;
const validateUserPut = (user) => {
    const schema = joi_1.default.object({
        fullName_ar: joi_1.default.string()
            .min(3)
            .max(50)
            .pattern(/^[\u0621-\u064A ]+$/),
        fullName_en: joi_1.default.string()
            .min(3)
            .max(50)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/),
        userName_ar: joi_1.default.string()
            .min(3)
            .max(30)
            .pattern(/^[\u0621-\u064A0-9 ]+$/),
        userName_en: joi_1.default.string()
            .min(3)
            .max(30)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/),
        email: joi_1.default.string().min(9).max(255).email(),
        password: joi_1.default.string().min(5).max(255),
        phone: joi_1.default.string()
            .min(7)
            .max(15)
            .pattern(/^[0-9]+$/),
        company: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE),
            then: joi_1.default.string().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
        phone2: joi_1.default.string()
            .min(7)
            .length(15)
            .pattern(/^[0-9]+$/),
        nationalId: joi_1.default.string().min(1).max(10),
        position: joi_1.default.string().min(2).max(255).required(),
        branch: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE),
            then: joi_1.default.string().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
        department: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE),
            then: joi_1.default.string().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
        nationality: joi_1.default.string()
            .min(5)
            .max(255)
            .valid(...enums_1.nationalities),
        address: joi_1.default.string().min(10).max(255).optional(),
        city: joi_1.default.string().min(2).max(50),
        maritalStatus: joi_1.default.string()
            .min(4)
            .max(50)
            .valid(...Object.keys(enums_1.MartialStatusEnum)),
        residencyExpiration: joi_1.default.date().greater('now'),
        birthDate: joi_1.default.string().isoDate(),
        shift: joi_1.default.when('role', {
            is: joi_1.default.valid(enums_1.Roles.EMPLOYEE),
            then: joi_1.default.string().alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        }),
        image: joi_1.default.string(),
    });
    const result = schema.validate(user);
    return result;
};
exports.validateUserPut = validateUserPut;
