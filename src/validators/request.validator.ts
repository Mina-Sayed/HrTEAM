import Joi from "joi"
import { IRequest } from "../models/Request"

export const validateRequest = (request: IRequest) => {
    const schema = Joi.object({
        title: Joi.any(),
        subCategory:Joi.any(),
        description: Joi.string().required(),
        from: Joi.object(),
        to: Joi.object(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        status: Joi.boolean(),
        ids:Joi.array()

    })
    return schema.validate(request)
}