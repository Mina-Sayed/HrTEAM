import Joi from "joi";
import { ISubTask } from "../models/subtask";


export const subTaskValidation = (subTask: ISubTask) =>
{
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        task: Joi.object().required(),
        isAccepted: Joi.boolean().required(),
        from: Joi.object().required(),
        company: Joi.object(),
        branch: Joi.object(),
    });
    return schema.validate(subTask);
};
