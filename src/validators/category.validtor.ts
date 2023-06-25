import { ICategory } from '../models/Category';
import Joi from "joi"
export function validateCategory(subCategory: ICategory) {

    // check the truthness of have time 
    // const haveTime = subCategory.haveTime;
    const schema = Joi.object({
        categoryType: Joi.string().required(),
        company: Joi.objectId()
    })
    return schema.validate(subCategory)
}