import Joi from "joi"
import { IoverTime } from "../models/OverTime";
export function validateOvertime(overtime: IoverTime) {
    const schema = Joi.object<IoverTime>({
        start: Joi.date().greater('now').alter({
            post: (schema) => schema.required(),
        }),
        end: Joi.date().alter({
            post: (schema) => schema.required(),
        }),
        shift: Joi.object().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden()
        })

    });
    const result = schema.validate(overtime);
    return result;
};