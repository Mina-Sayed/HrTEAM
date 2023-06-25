import Joi from "joi";
import { IRequest } from "../models/Request";
import { ISubCategory } from "../models/SubCategory";

export function validateSubCategory(subCategory: ISubCategory) {

    // check the truthness of have time 
    // const haveTime = subCategory.haveTime;
    const schema = Joi.object({
        subType: Joi.string().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        haveTime: Joi.boolean().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden(),
        }),
        category: Joi.objectId().alter({
            post: (schema: any) => schema.required(),
            put: (schema: any) => schema.forbidden(),
        }),
    
    })
    return schema.validate(subCategory)
}