import Joi from "joi";
import { ICompany } from "../models/company";


export function validateCompany(company: any)
{
    const schema = Joi.object<ICompany>({
        name: Joi.string().min(3).max(255).required(),
        owner: Joi.object().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden(),
        }),
    });
    return schema.validate(company);
}


export function validateAddCompany(owner: String, companies: Array<any>) {}

export const companySchema = Joi.object().keys({
    name: Joi.string().min(1).max(255).required(),
    owner: Joi.object().alter({
        post: (schema: any) => schema.required(),
        put: (schema: any) => schema.forbidden(),
    }),
});