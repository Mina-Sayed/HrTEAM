import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Schema } from 'mongoose'
const schema = new Schema({
  isSeen: {
    type: Boolean,
    default: false,
  },
  company: {
    type: ObjectId,
    ref: 'company',
  },
  to: {
    type: ObjectId,
    ref: 'user',
  },
  employee: {
    type: ObjectId,
    ref: 'user',
  },
  days: Number,
  des_en: {
    type: String,
  },
  type: String,
  des_ar: String,
  title_en: String,
  title_ar: String,
}, { timestamps: true })
export const Notification = mongoose.model('notification', schema)
