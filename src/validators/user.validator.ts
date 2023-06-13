import Joi from "joi";
import { IUser } from "../models/user";
import { MartialStatus, nationalities, Roles } from "../types/enums";

// a7a ya abdo
const validateUserPost = (user: any, reqType: any) =>
{
    const schema = Joi.object<IUser>({
        fullName_ar: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^[\u0621-\u064A ]+$/),
        // .required(),,
        fullName_en: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/)
        // .required(),
        ,
        userName_ar: Joi.string()
            .min(3)
            .max(30)
            .pattern(/^[\u0621-\u064A0-9 ]+$/)
        // .required(),
        ,
        userName_en: Joi.string()
            .min(3)
            .max(30)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/)
        // .required(),
        ,
        image: Joi.string().alter({
            post: (schema: any) => schema.required(),
        }),
        email: Joi.string().min(9).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),
        phone: Joi.string()
            .min(7)
            .max(15)
            .pattern(/^[0-9]+$/)
            .required(),
        company: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE, Roles.ADMIN),
            then: Joi.string().required(),
        }),
        phone2: Joi.string()
            .min(7)
            .length(15)
            .pattern(/^[0-9]+$/),
        nationalId: Joi.string().min(14).max(14),
        position: Joi.string().min(2).max(255),
        branch: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE, Roles.ADMIN),
            then: Joi.object().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
        department: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE, Roles.ADMIN),
            then: Joi.object().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
        nationality: Joi.string()
            .min(5)
            .max(255)
            .valid(...nationalities),
        address: Joi.string().min(10).max(200),
        city: Joi.string().min(2).max(50),
        maritalStatus: Joi.string()
            .min(4)
            .max(50)
            .valid(...Object.keys(MartialStatus)),
        residencyExpiration: Joi.date().greater("now"),
        birthDate: Joi.string().isoDate(),
        role: Joi.string(),
        shift: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE, Roles.ADMIN),
            then: Joi.object().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
    });

    return schema.tailor(reqType).validate(user);
};

const validateUserPut = (user: any) =>
{
    const schema = Joi.object<IUser>({
        fullName_ar: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^[\u0621-\u064A ]+$/),
        fullName_en: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/),
        userName_ar: Joi.string()
            .min(3)
            .max(30)
            .pattern(/^[\u0621-\u064A0-9 ]+$/),
        userName_en: Joi.string()
            .min(3)
            .max(30)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/),
        email: Joi.string().min(9).max(255).email(),
        password: Joi.string().min(5).max(255),
        phone: Joi.string()
            .min(7)
            .max(15)
            .pattern(/^[0-9]+$/),
        company: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE),
            then: Joi.string().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
        phone2: Joi.string()
            .min(7)
            .length(15)
            .pattern(/^[0-9]+$/),
        nationalId: Joi.string().min(1).max(10),
        position: Joi.string().min(2).max(255).required(),
        branch: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE),
            then: Joi.string().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
        department: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE),
            then: Joi.string().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
        nationality: Joi.string()
            .min(5)
            .max(255)
            .valid(...nationalities),
        address: Joi.string().min(10).max(255).optional(),
        city: Joi.string().min(2).max(50),
        maritalStatus: Joi.string()
            .min(4)
            .max(50)
            .valid(...Object.keys(MartialStatus)),
        residencyExpiration: Joi.date().greater("now"),
        birthDate: Joi.string().isoDate(),
        shift: Joi.when("role", {
            is: Joi.valid(Roles.EMPLOYEE),
            then: Joi.string().alter({
                post: (schema: {
                    required: () => any
                }) => schema.required(),
                put: (schema: {
                    forbidden: () => any
                }) => schema.forbidden(),
            }),
        }),
        image: Joi.string(),
    });

    return schema.validate(user);
};

export { validateUserPost, validateUserPut };
