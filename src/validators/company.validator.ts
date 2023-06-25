import Joi from "joi"
import { ICompany } from "../models/Company";
export function validateCompany(company: any) {
    const schema = Joi.object<ICompany>({
        name: Joi.string().min(1).max(255).required(),
        owner: Joi.objectId().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden()
        })
    });
    const result = schema.validate(company);
    return result;
}
export function validateAddCompany(woner: String, companies: Array<any>) {

}