import Joi from 'joi';
import { PackageI } from '../models/Packages';

const validatePackage = (pack: any) => {
    const schema = Joi.object<PackageI>({
        name_ar: Joi.string().min(3).max(50).pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        name_en: Joi.string().min(3).max(50).pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$/).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        duration: Joi.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        sale: Joi.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        maxCompaniesAllowed: Joi.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        maxEmployeesAllowed: Joi.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        price_SR: Joi.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        price_USD: Joi.number().integer().min(1).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    });
    const result = schema.validate(pack);
    return result;
}

export default validatePackage;