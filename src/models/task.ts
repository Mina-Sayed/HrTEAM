import { model } from 'mongoose';
import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose'
import { TaskStatus } from '../types/enums'
import { NextFunction } from 'express'
import SubTask from './subTask'
export interface ITask {
  start: Date
  end: Date
  from: mongoose.Schema.Types.ObjectId
  to: [mongoose.Schema.Types.ObjectId]
  title: String
  description: String
  company:ObjectId,
  branch:ObjectId,
  status: TaskStatus,
}
const taskSchema = new Schema<ITask>({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  company:{
    type:ObjectId,
    ref:"company"
  },
  branch:{
    type:ObjectId,
    ref:"branches"
  },
  status: {
    enum: TaskStatus,
    type: String,
    default: TaskStatus.INPROGRESS,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
})

// hock for deleting the subTask when the task is deleted

// taskSchema.pre("save", async function (next) {
//   //   console.log(this)
//   const { title, description, to, from, start, end, status } = this;
//   console.log("===================================calling this");
//  to.map(async task =>{
//     const subtask=new SubTask({ title, description, to: task, from, start, end, status })
//     await subtask.save()
//  })

//   //   console.log({
//   //     title,
//   //     description,
//   //     to,
//   //     from,
//   //     start,
//   //     end,
//   //     status,
//   //   })
// });
taskSchema.methods.forwardSubTasks = async (next: NextFunction) => {}
const Task = model<ITask>('Task', taskSchema)
export default Task
