import Joi from "joi";
import { IOvertime } from "../models/overtime";


export function validateOvertime(overtime: IOvertime)
{
    const schema = Joi.object<IOvertime>({
        start: Joi.date().greater("now").alter({
            post: (schema) => schema.required(),
        }),
        end: Joi.date().alter({
            post: (schema) => schema.required(),
        }),
        shift: Joi.object().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden(),
        }),

    });
    return schema.validate(overtime);
};