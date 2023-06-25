import Joi from 'joi';
import { SubscriptionI } from '../models/Subscription';

const validateSubscription = (pack: any) => {
    const schema = Joi.object<SubscriptionI>({
        startDate: Joi.date().alter({
            post: (schema: { required: () => any; }) => schema.required(),
            put: (schema: { forbidden: () => any; }) => schema.forbidden(),
        }),
        subscriber: Joi.objectId().alter({
            post: (schema: { required: () => any; }) => schema.required(),
            put: (schema: { forbidden: () => any; }) => schema.forbidden(),
        }),
        package:  Joi.objectId().alter({
            post: (schema: { required: () => any; }) => schema.required(),
            put: (schema: { forbidden: () => any; }) => schema.forbidden(),
        }),
    });
    const result = schema.validate(pack);
    return result;
}

export default validateSubscription;