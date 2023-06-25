import Joi from "joi"
import { ITask } from "../models/task"

export const taskValidation = (task: ITask, reqType: any) => {
    const schema = Joi.object({
        start: Joi.date().alter({
            post: (schema: any) => schema.required(),
        }),
        end: Joi.date().alter({
            post: (schema: any) => schema.required(),
        }),
        to: Joi.array().items(Joi.objectId().alter({
            post: (schema: any) => schema.required(),
        }),),
        title: Joi.string().alter({
            post: (schema: any) => schema.required(),
        }),
        description: Joi.string().alter({
            post: (schema: any) => schema.required(),
        }),
        company: Joi.objectId(),
        branch: Joi.objectId(),
        status: Joi.string().valid('in progress', 'completed')
    })
    return schema.tailor(reqType).validate(task)
}