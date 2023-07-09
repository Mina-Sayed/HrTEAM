import Joi from 'joi'
import { ISubTask } from '../models/subTask'

export const subTaskValidation = (subTask: ISubTask) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    task: Joi.object().required(),
    isAccepted: Joi.boolean().required(),
    from: Joi.object().required(),
    company:Joi.object(),
    branch:Joi.object()
  })
  const result = schema.validate(subTask)
  return result
}
