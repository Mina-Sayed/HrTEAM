import mongoose, { Schema } from 'mongoose'
import { ObjectId } from 'mongodb'
const schema = new Schema({
  path: String,
  userId: {
    type: ObjectId,
    ref: 'User',
  },
})
export const Document = mongoose.model('documents', schema)
