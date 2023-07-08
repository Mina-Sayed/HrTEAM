import Joi from 'joi'
import { IContract } from '../models/Contract'

export const ContractValidation = (contract: IContract, typeReq: any) => {
  const validationSchema = Joi.object({
    employee: Joi.object().required(),
    bankAccount: Joi.object().keys({
      accountName: Joi.string(),
      accountNumber: Joi.number(),
      balance: Joi.number(),
    }),
    branch: Joi.object().required(),
    department: Joi.object().required(),
    salary: Joi.number().required(),
    duration: Joi.number().required(),
    startDate: Joi.date().required(),
    countryStay: Joi.string().required(),
    durationStay: Joi.number().when('countryStay', {
      is: Joi.string().empty(Joi.not('Saudi')),
      then: Joi.number().required(),
      // otherwise: Joi.forbidden(),
    }),
    startStay: Joi.date().when('countryStay', {
      is: Joi.string().empty(Joi.not('Saudi')),
      then: Joi.date().required(),
      // otherwise: Joi.forbidden(),
    }),
    endStay: Joi.date(),
  })
  const result = validationSchema.tailor(typeReq).validate(contract)
  return result
}
