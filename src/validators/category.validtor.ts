import { ICategory } from "../models/category";
import Joi from "joi";


export function validateCategory(subCategory: ICategory)
{

    // check the truthness of have time 
    // const haveTime = subCategory.haveTime;
    const schema = Joi.object({
        categoryType: Joi.string().required(),
        company: Joi.object(),
    });
    return schema.validate(subCategory);
}