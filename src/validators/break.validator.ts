import Joi from "joi";
import { IBreak } from "../models/break";


export const validateBreak = (breakTime: IBreak, mode: any) =>
{
    const schema = Joi.object<IBreak>({
        start: Joi.when("isOpen", {
            is: Joi.boolean().valid(false),
            then: Joi.object({
                hours: Joi.number().required().min(0).max(23),
                mins: Joi.number().min(0).max(59),
            }).required(),
            otherwise: Joi.forbidden(),
        }),
        end: Joi.when("isOpen", {
            is: Joi.boolean().valid(false),
            then: Joi.object({
                hours: Joi.number().required().min(0).max(23),
                mins: Joi.number().required(),
            }).required(),
            otherwise: Joi.forbidden(),
        }),
        isOpen: Joi.boolean(),
        duration: Joi.when("isOpen", {
            is: Joi.boolean().valid(true),
            then: Joi.object({
                hours: Joi.number().required().min(0).max(23),
                mins: Joi.number().min(0).max(59),
            }).required(),
            otherwise: Joi.forbidden(),
        }),
        shift: Joi.object().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden(),
        }),
    });
    return schema.tailor(mode).validate(breakTime);
};
