import Joi from "joi"
import { IPayRol } from "../models/payrol"

export const paryrolValidation=(payrol:IPayRol)=>{
    const schema=Joi.object({
        employee:Joi.objectId().required(),
        day:Joi.date().required(),
        dailySalary:Joi.number().required(),
        originalTime:Joi.number().required(),
        lateTime:Joi.number().required(),
        type:Joi.string().valid('shift','overtime')
    })
    return  schema.validate(payrol)
}