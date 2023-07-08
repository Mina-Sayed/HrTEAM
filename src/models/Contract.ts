import { nationalities } from './../types/enums';
import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'
export interface IContract {
  employee: mongoose.Schema.Types.ObjectId
  bankAccount: {
    accountName: String
    accountNumber: Number
    balance: Number
  }
  salary: Number
  duration: Number
  startDate: Date
  endDate: Date
  dailySalary: Number
  branch: ObjectId
  department: ObjectId
  countryStay: String,
  durationStay: Number,
  startStay: Date,
  endStay: Date,
  getDailySalary: (salary: Number, duration: Number) => Number
  getEndDate: (startDate: Date, duration: Number) => Date
  getEndDateStay: (startDate: Date, duration: Number) => Date
}

const ContractSchema = new Schema<IContract>({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  branch: {
    type: ObjectId,
    ref: "Branches"
  },
  department: {
    type: ObjectId,
    ref: "Departments"
  },
  bankAccount: {
    accountName: { type: String },
    accountNumber: { type: Number },
    balance: { type: Number },
  },
  salary: { type: Number, required: true },
  dailySalary: Number,
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  countryStay: {
    type: String,
    enum: nationalities
  },
  durationStay: Number,
  startStay: Date,
  endStay: Date,
}, { timestamps: true })

ContractSchema.methods.getDailySalary = function (
  salary: number,
  duration: number,
) {
  const mothlyDays = 30
  return Number(salary / (duration * mothlyDays))
}
ContractSchema.methods.getEndDate = function (
  startDate: Date,
  duration: number,
) {
  // what should we do next
  return new Date(
    new Date(startDate).setMonth(new Date(startDate).getMonth() + duration),
  )
}

const Contract = mongoose.model<IContract>('Contract', ContractSchema)
export default Contract
