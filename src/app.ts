import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import bodyParser from 'body-parser'
import Joi from 'joi'
import userRouter from './routes/v1/user.router'
import packageRouter from './routes/v1/package.router'
import subscriptionsRouter from './routes/v1/subscription.router'
import authRouter from './routes/v1/auth.router'
import branch from './routes/v1/branch.router'
import department from './routes/v1/department.router'
import shift from './routes/v1/shift.router'
import request from './routes/v1/request.router'
import category from './routes/v1/category.router'
import subCategory from './routes/v1/subCategory.router'
import contract from './routes/v1/contract.router'
import payrol from './routes/v1/payrol.router'
import task from './routes/v1/task.router'
import subtask from './routes/v1/subtask.router'
Joi.object = require('joi-objectid')(Joi)
import company from './routes/v1/company.router'
import overTime from './routes/v1/overtime.router'
import Break from './routes/v1/break.router'
import attend from './routes/v1/attende.router'
import blogs from './routes/v1/blog.routes'
import comment from './routes/v1/comment.routes'
import rate from './routes/v1/rate.routes'
import notifs from './routes/v1/notifiction.routes'
import document from './routes/v1/document.router'
import { upload } from './middlewares/uploads'
import { errorHandler } from './errors/error'
import { handler } from './middlewares/catchAsync'
import postRouter from "./routes/v1/post.router";
import servicesRouter from "./routes/v1/services.router";
import fs from "fs"
// import ip from 'ip'
// const API_KEY = 'c0d773f89b0b8d96b8ec209db1b72153a8c5aefcf33813684dd561dd'
// const URL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + API_KEY
// import axios from 'axios'
// const sendAPIRequest = async (ipAddress: any) => {
//   const apiResponse = await axios.get(URL + '&ip_address=' + ipAddress)
//   return apiResponse.data
// }
// import attend from './routes/v1/'
const app = express()
process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))
dotenv.config({
  path: path.resolve(__dirname + `/config/${process.env.NODE_ENV}.env`),
})
app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))

// Routes
// app.get('/', async (req, res) => {
//   const ipAddress = ip.address()
//   const info = await sendAPIRequest('192.168.1.1')
//   console.log(info)

//   res.send(info)
// })
app.use(errorHandler)
  .use(express.json())

  // .use(errorHandler)
  .use('/teamHR/api/v1/auth/', authRouter)
  .use('/teamHR/api/v1/user/', userRouter)
  .use('/teamHR/api/v1/package/', packageRouter)
  .use('/teamHR/api/v1/subscription/', subscriptionsRouter)
  .use('/teamHR/api/v1/company/', company)
  .use('/teamHR/api/v1/branch/', branch)
  .use('/teamHR/api/v1/department/', department)
  .use('/teamHR/api/v1/shift/', shift)
  .use('/teamHR/api/v1/category', category)
  .use('/teamHR/api/v1/subCategory', subCategory)
  .use('/teamHR/api/v1/request', request)
  .use('/teamHR/api/v1/contract', contract)
  .use('/teamHR/api/v1/payrol', payrol)
  .use('/teamHR/api/v1/task', task)
  .use('/teamHR/api/v1/subtask', subtask)
  .use('/teamHR/api/v1/break', Break)
  .use('/teamHR/api/v1/over', overTime)
  .use('/teamHR/api/v1/attendance', attend)
  .use('/teamHR/api/v1/blog', blogs)
  .use('/teamHR/api/v1/comment', comment)
  .use('/teamHR/api/v1/rate', rate)
  .use('/teamHR/api/v1/notifiction', notifs)
  .use('/teamHR/api/v1/document', document)
  .use("/teamHR/api/v1/post", postRouter)
  .use("/teamHR/api/v1/services", servicesRouter)
  .use('/uploads', express.static('./uploads'))
  .post('/teamHR/api/v1/upload', upload.single('image'), (req:any, res:any) => {
    res.status(200).send({ filename: req.file?.filename })
  })
  .all('*', (req: Request, res: Response) =>
    res.status(404).send({ message: 'Undefinded Routes' }),
  )

export default app
