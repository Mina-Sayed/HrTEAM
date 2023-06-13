import Joi from "joi";
import { ISubscription } from "../models/subscription";


const validateSubscription = (pack: any) =>
{
    const schema = Joi.object<ISubscription>({
        startDate: Joi.date().alter({
            post: (schema: {
                required: () => any;
            }) => schema.required(),
            put: (schema: {
                forbidden: () => any;
            }) => schema.forbidden(),
        }),
        subscriber: Joi.object().alter({
            post: (schema: {
                required: () => any;
            }) => schema.required(),
            put: (schema: {
                forbidden: () => any;
            }) => schema.forbidden(),
        }),
        package: Joi.object().alter({
            post: (schema: {
                required: () => any;
            }) => schema.required(),
            put: (schema: {
                forbidden: () => any;
            }) => schema.forbidden(),
        }),
    });
    return schema.validate(pack);
};

export default validateSubscription;