import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";


export interface ISubTask
{
  title: String
  description: String
  start: Date
  end: Date
  isAccepted: Boolean
  task: mongoose.Schema.Types.ObjectId
  from: mongoose.Schema.Types.ObjectId
  receivedUser: mongoose.Schema.Types.ObjectId
  status: Boolean
  company: {
    type: ObjectId,
    ref: "company"
  },
  branch: {
    type: ObjectId,
    ref: "branches"
  },

}

const subTaskSchema = new Schema<ISubTask>({

  title: {
    type: String,
  },
  description: {
    type: String,
  },
  start: { type: Date },
  end: { type: Date },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receivedUser: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: ObjectId,
    ref: "company",
  },
  branch: {
    type: ObjectId,
    ref: "branches",
  },
});
const Subtask = mongoose.model<ISubTask>("Subtask", subTaskSchema);
export default Subtask;
