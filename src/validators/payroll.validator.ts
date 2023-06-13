import Joi from "joi";
import { IPayroll } from "../models/payroll";


export const payrollValidator = (payroll: IPayroll) =>
{
    const schema = Joi.object({
        employee: Joi.object().required(),
        day: Joi.date().required(),
        dailySalary: Joi.number().required(),
        originalTime: Joi.number().required(),
        lateTime: Joi.number().required(),
        type: Joi.string().valid("shift",
            "overtime"),
    });
    return schema.validate(payroll);
};