import { ObjectId } from 'mongodb'
import Joi from 'joi'
import mongoose, { Schema } from 'mongoose'

export interface IRequest {
  title: String
  description: String
  from: mongoose.Schema.Types.ObjectId
  to: mongoose.Schema.Types.ObjectId
  startDate: Date
  endDate: Date
  status: Boolean
  company: ObjectId
  branch: ObjectId
  department: ObjectId
  type: String
}

const requestSchema = new Schema<IRequest>(
  {
    title: {
      type: mongoose.Schema.Types.Mixed,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company',
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'branches',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'departments',
    },
    description: {
      type: String,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
      default: 'request',
    },
    status: { type: Boolean },
  },
  { timestamps: true },
)
const Request = mongoose.model<IRequest>('Request', requestSchema)
export default Request
