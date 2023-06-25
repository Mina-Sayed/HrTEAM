import { Branch } from './../../models/Branch'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Response, NextFunction } from 'express'

import Task, { ITask } from '../../models/task'
import { Roles } from '../../types/enums'
import mongoose, { ObjectId } from 'mongoose'
import SubTask from '../../models/subTask'
import User from '../../models/User'
import { Company } from '../../models/Company'
// @Desc : get all the tasks
// @Route : GET /teamHR/api/v1/task

export const forwardSubtasks = (SendedTask: any) => {
  const {
    title,
    description,
    to,
    from,
    start,
    end,
    status,
    company,
    branch,
  } = SendedTask
  const data = to.map(async (refTask: any) => {
    const data = {
      title,
      description,
      recivedUser: refTask,
      from: SendedTask.from,
      start,
      branch,
      company,
      end,
      task: SendedTask._id,
    }
    const dataREs = await SubTask.insertMany(data)
    return dataREs
  })
  return data
}
export const updateForwardedTask = (sendedTask: any) => {
  const { title, description, to, from, start, end, status } = sendedTask
  to.map(async (refTask: any) => {
    const subtask = await SubTask.find({ task: sendedTask._id }).updateMany({
      title,
      description,
      reciv: refTask,
      from: refTask.from,
      start,
      end,
      task: sendedTask._id,
    })
  })
}
// export const MyTasks = async (req: AuthenticatedReq, res: Response) => {
//   let tasks: any
//   if (tasks.length <= 0)
//     return res.status(400).send({ success: false, message_en: 'NO Task Found' })
//   res.status(200).send({
//     success: true,
//     message_en: 'Tasks Are Fetched Successfully',
//     tasks,
//   })
//   if (req.user?.role === 'employee') {
//     tasks = await SubTask.find({
//       from: req.user._id,
//     }).populate('task recivedUser from')
//   }
// }
export const getAllTasks = async (req: AuthenticatedReq, res: Response) => {
  let tasks: any
  if (req.user?.role === 'employee') {
    tasks = await Task.find({
      $or: [
        {
          from: req.user._id,
          to:{$in:req.user._id}
        },
        {
          to:{$in:req.user._id}
        },
        {
          from: req.user._id,
        },
      ],
    
    }).populate('to from')
    
  }
  // return tasksFromThe subTasks
  if (req.user?.role === Roles.ADMIN || req.user?.role === Roles.ROOT) {
    const { company, branch } = req.query
    const admins = (await User.find({ company: company })).map((admin) =>
      admin._id.toString(),
    )
    tasks = await Task.find({
      $or: [
        {
          company: company,
        },
        {
          branch: branch,
        },
      ],
    }).populate('to from')
  }
  if (tasks.length <= 0)
    return res.status(400).send({ success: false, message_en: 'No Task Found' })
  res.status(200).send({
    success: true,
    message_en: 'Tasks Are Fetched Successfully',
    tasks,
  })
}

//@DESC : get Task By Id
//@Route : Get /teamHR/api/v1/task/:id
export const getTaskById = async (req: AuthenticatedReq, res: Response) => {
  const taskId = req.params.id
  const task = await Task.findById(taskId)
  if (!task)
    return res.status(400).send({ success: false, message: 'Task Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Task Fetched Successfullly', task })
}

//@Desc: Add Task
//@Route : POST /teamHR/api/v1/task
export const addTask = async (req: AuthenticatedReq, res: Response) => {
  // if((req as AuthenticatedReq).user?.role !=Roles.ROOT){
  //     return res.status(400).send({success:false,message_en:`You Don't have Access to add Task`})
  // }
  const user = await User.find({ _id: req.body.to })
  if (!user[0]) return res.status(400).send({ error_en: 'Invalid users !!' })
  let task: any = []
  if (req.user?.role === Roles.EMPLOYEE) {
    task = new Task({
      ...req.body,
      from: req.user?._id,
      company: req.user.company,
      branch: req.user.branch,
      to: req.body.to,
    })
  }
  if (req.user?.role === Roles.ADMIN) {
    const { branch } = req.body
    if (!branch)
      return res.status(400).send({ error_en: 'the branch is requierd !!' })
    task = new Task({
      ...req.body,
      from: req.user?._id,
      company: req.user.company,
      branch: branch,
      to: req.body.to,
    })
  }
  if (req.user?.role === Roles.ROOT) {
    const { company, branch } = req.body
    if (!company || !branch)
      return res
        .status(400)
        .send({ error_en: 'the company and the branch requierd !!' })
    task = new Task({
      ...req.body,
      from: req.user?._id,
      company: company,
      branch: branch,
      to: req.body.to,
    })
  }
  //

  forwardSubtasks(task)
  await task.save()
  const subTasks = await SubTask.find({ task: task._id }).populate('task')
  res.status(200).send({
    success: true,
    message_en: 'Task is Added Successfully',
    task,
    subTasks,
  })
}
//@DESC : update Task
//@Route : PUT /teamHR/api/v1/task/:id
export const updateTask = async (req: AuthenticatedReq, res: Response) => {
  const taskId = req.params.id
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      ...req.body,
      status: req.body.status == 'in progress' ? 'completed' : 'in progress',
    },
    { new: true },
  )
  updateForwardedTask(task)
  if (!task)
    return res
      .status(400)
      .send({ success: false, message_en: 'Task is Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Task updated Successfully', task })
}
//@DESC : delete Task ById
//Route : DELETE /teamHR/api/v1/task/:id
export const deleteTask = async (req: AuthenticatedReq, res: Response) => {
  console.log('reqParamsOnDelete: ',req.params.id)
  const TaskId = req.params.id
  console.log(TaskId)
  const task = await Task.findByIdAndRemove(TaskId)
  if (!task)
    return res
      .status(400)
      .send({ success: false, message_en: 'Task Not Found' })
  await SubTask.deleteMany({ task: TaskId })

  res
    .status(200)
    .send({ success: true, message_en: 'Task Deleted Successfully' })
}

//@DESC : assgin user to Task
//@Route : PUT /teamHR/api/v1/task/assgin/:id
export const assginTask = async (req: AuthenticatedReq, res: Response) => {
  const taskId = req.params.id
  const user = await User.findOne({ _id: req.body.to })
  if (!user) return res.status(400).send({ error_en: 'Invalid user !!' })
  const checkTaks = await Task.findOne({
    _id: taskId,
    to: { $elemMatch: { $in: req.body.to } },
  })
  if (checkTaks)
    return res.status(400).send({ error_en: 'user already assgin to the task' })
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $push: {
        to: req.body.to,
      },
    },
    { new: true },
  )
  forwardSubtasks(task)
  if (!task)
    return res
      .status(400)
      .send({ success: false, message_en: 'Task is Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Task updated Successfully', task })
}
//@DESC : unassgin user to Task
//@Route : PUT /teamHR/api/v1/task/unassgin/:id
export const unassginTask = async (req: AuthenticatedReq, res: Response) => {
  const taskId = req.params.id
  const user = await User.findOne({ _id: req.body.to })
  if (!user) return res.status(400).send({ error_en: 'Invalid user !!' })

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $pull: {
        to: { $in: req.body.to },
      },
    },
    { new: true },
  )
  await SubTask.deleteMany({ recivedUser: req.body.to })
  if (!task)
    return res
      .status(400)
      .send({ success: false, message_en: 'Task is Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Task updated Successfully', task })
}
// let sortTasks: any = {}

// for (let index = 0; index < tasksCom.length; index++) {
//   let task: any = tasksCom[index]
//   let subTask = await SubTask.find({ task: task._id.toString()})
//   const taskWithSub = {
//     task,
//     subTask
//   }
//   sortTasks[task.from.branch._id.toString()]
//     ? (sortTasks[task.from.branch._id.toString()] = {
//         branch: task.from.branch,
//         tasks: sortTasks[task.from.branch._id.toString()].tasks = [
//           ...sortTasks[task.from.branch._id.toString()].tasks,
//           taskWithSub,
//         ],
//       })
//     : (sortTasks[task.from.branch._id.toString()] = {
//         branch: task.from.branch,
//         tasks: [taskWithSub],
//       })
// }
// res.send(sortTasks)
// tasks = sortTasks
