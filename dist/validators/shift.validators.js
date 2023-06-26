"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShift = void 0;
const enums_1 = require("./../types/enums");
const joi_1 = __importDefault(require("joi"));
/**
 *   V2
 export const validateShift = (shift: IShift) => {
    const schema = joi.object<IShift>({
        name: joi.string().min(3).max(50).pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.required(),
        }),
        typeShift: joi.string().valid(...TypeShift),
        day: joi.when("typeShift", {
            is: joi.string().valid('day'),
            then: joi.object({
                start_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                    return helper.message("the start hour for shift is requierd");
                }),
                end_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                    if (!value) return helper.message("the end hour for shift is requierd");
                    if (value <= ref('day').start_hour) return helper.message("The end hour cannot be smaller than the start hour");
                }),
            }).required(),
            otherwise: joi.forbidden()
        }),
        weeks: joi.when('typeShift', {
            is: joi.string().valid('week'),
            then: object({
                start_day: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                    return helper.message("the start day for shift is requierd");
                }),
                end_day: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                    if (!value) return helper.message("the end day for shift is requierd");
                    if (value <= ref('weeks').start_day) return helper.message("The end day cannot be smaller than the start day");
                }),
                days: object({
                    start_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                        return helper.message("the start hour for shift is requierd");
                    }),
                    end_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                        if (!value) return helper.message("the end hour for shift is requierd");
                        if (value <= ref('weeks').days.start_hour) return helper.message("The end hour cannot be smaller than the start hour");
                    })
                }).required()
            }).required()
        }),
        months: when('typeShift', {
            is: string().valid('month'),
            then: object({
                start_month: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                    return helper.message("the start month for shift is requierd");
                }),
                end_month: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                    if (!value) return helper.message("the end month for shift is requierd");
                    if (value <= ref('months').start_month) return helper.message("The end month cannot be smaller than the start month");
                }),
                weeks: object({
                    start_day: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                        return helper.message("the start day for shift is requierd");
                    }),
                    end_day: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                        if (!value) return helper.message("the end day for shift is requierd");
                        if (value <= ref('months').weeks.start_day) return helper.message("The end day cannot be smaller than the start day");
                    }),
                    days: object({
                        start_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                            return helper.message("the start hour for shift is requierd");
                        }),
                        end_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                            if (!value) return helper.message("the end hour for shift is requierd");
                            if (value <= ref('months').weeks.days.start_hour) return helper.message("The end hour cannot be smaller than the start hour");
                        })
                    }).required()
                }).required()
            }).required()
        }),
        years: when("typeShift", {
            is: string().valid('year'),
            then: object({
                start_year: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                    return helper.message("the start month for shift is requierd");
                }),
                end_year: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                    if (!value) return helper.message("the end month for shift is requierd");
                    if (value <= ref('years').start_year) return helper.message("The end year cannot be smaller than the start year");
                }),
                months: object({
                    start_month: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                        return helper.message("the start month for shift is requierd");
                    }),
                    end_month: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                        if (!value) return helper.message("the end month for shift is requierd");
                        if (value <= ref('years').months.start_month) return helper.message("The end month cannot be smaller than the start month");
                    }),
                    weeks: object({
                        start_day: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                            return helper.message("the start day for shift is requierd");
                        }),
                        end_day: joi.number().min(0).max(6).required().custom((value: Number, helper: any) => {
                            if (!value) return helper.message("the end day for shift is requierd");
                            if (value <= ref('years').months.weeks.start_day) return helper.message("The end day cannot be smaller than the start day");
                        }),
                        days: object({
                            start_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                                return helper.message("the start hour for shift is requierd");
                            }),
                            end_hour: joi.number().min(0).max(23).required().custom((value: Number, helper: any) => {
                                if (!value) return helper.message("the end hour for shift is requierd");
                                if (value <= ref('years').months.weeks.days.start_hour) return helper.message("The end hour cannot be smaller than the start hour");
                            })
                        }).required()
                    }).required()
                }).required()
            }).required()
        })

    })
    const result = schema.validate(shift);
    return result;
}
 */
const validateShift = (shift, reqType) => {
    const schema = joi_1.default.object({
        name: joi_1.default
            .string()
            .min(3)
            .max(50)
            .pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/)
            .alter({
            post: (schema) => schema.required(),
        }),
        branch: joi_1.default.object().alter({
            post: (schema) => schema.required(),
        }),
        start_day: joi_1.default
            .number()
            .min(0)
            .max(6)
            .valid(...enums_1.days)
            .required()
            .alter({
            post: (schema) => schema.required(),
        }),
        end_day: joi_1.default
            .number()
            .min(0)
            .max(6)
            .valid(...enums_1.days)
            .required()
            .custom((value, helper) => {
            if (value <= shift.start_day)
                return helper.message('The end day cannot be smaller than the start day');
        })
            .alter({
            post: (schema) => schema.required(),
        }),
        time: joi_1.default
            .object({
            start_hour: joi_1.default.number().min(0).max(23).required(),
            start_mins: joi_1.default.number().min(0).max(59).required(),
            end_hour: joi_1.default
                .number()
                .min(0)
                .max(23)
                .required()
                .custom((value, helper) => {
                if (value <= shift.time.start_hour)
                    return helper.message('The end hour cannot be smaller than the start hour');
            }),
            end_mins: joi_1.default.number().min(0).max(59).required(),
        })
            .alter({
            post: (schema) => schema.required(),
        }),
        allows: joi_1.default
            .object({
            lateTime: joi_1.default.object({
                hours: joi_1.default.number().min(0).max(23),
                mins: joi_1.default.number().min(0).max(59),
            }),
            leavingTime: joi_1.default.object({
                hours: joi_1.default.number().min(0).max(23),
                mins: joi_1.default.number().min(0).max(59),
            }),
            weeklyHolidays: joi_1.default.array().items(),
            overTime: joi_1.default.object({
                hour: joi_1.default.number(),
                mins: joi_1.default.number().min(0).max(59),
            }),
        })
            .alter({
            post: (schema) => schema.required(),
        }),
    });
    const result = schema.tailor(reqType).validate(shift);
    return result;
};
exports.validateShift = validateShift;
