import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import Joi from "joi";
import userRouter from "./routes/v1/user.router";
import packageRouter from "./routes/v1/package.router";
import subscriptionRouter from "./routes/v1/subscription.router";
import authRouter from "./routes/v1/auth.router";
import branchRouter from "./routes/v1/branch.router";
import departmentRouter from "./routes/v1/department.router";
import shiftRouter from "./routes/v1/shift.router";
import requestRouter from "./routes/v1/request.router";
import categoryRouter from "./routes/v1/category.router";
import subCategoryRouter from "./routes/v1/subCategory.router";
import contractRouter from "./routes/v1/contract.router";
import payrollRouter from "./routes/v1/payroll.router";
import taskRouter from "./routes/v1/task.router";
import subtaskRouter from "./routes/v1/subtask.router";
import companyRouter from "./routes/v1/company.router";
import overTimeRouter from "./routes/v1/overtime.router";
import breakRouter from "./routes/v1/break.router";
import attendRouter from "./routes/v1/attendance.router";
import blogsRouter from "./routes/v1/blog.router";
import commentRouter from "./routes/v1/comment.router";
import rateRouter from "./routes/v1/rate.router";
import notifsRouter from "./routes/v1/notification.router";
import documentRouter from "./routes/v1/document.router";
import { upload } from "./middlewares/uploads";
import { errorHandler } from "./responses/error";
import postRouter from "./routes/v1/post.router";
import servicesRouter from "./routes/v1/services.router";

Joi.object = require("joi-objectid")(Joi);
// import ip from 'ip'
// const API_KEY = 'c0d773f89b0b8d96b8ec209db1b72153a8c5aefcf33813684dd561dd'
// const URL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + API_KEY
// import axios from 'axios'
// const sendAPIRequest = async (ipAddress: any) => {
//   const apiResponse = await axios.get(URL + '&ip_address=' + ipAddress)
//   return apiResponse.data
// }
// import attend from './routes/v1/'

const app = express();
process.env.NODE_ENV !== "production" && app.use(morgan("dev"));
dotenv.config({
  path: path.resolve(__dirname + `/config/development.env`),
});
app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

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
  .use("/teamHR/api/v1/auth", authRouter)
  .use("/teamHR/api/v1/user", userRouter)
  .use("/teamHR/api/v1/package/", packageRouter)
  .use("/teamHR/api/v1/subscription/", subscriptionRouter)
  .use("/teamHR/api/v1/company/", companyRouter)
  .use("/teamHR/api/v1/branch", branchRouter)
  .use("/teamHR/api/v1/department/", departmentRouter)
  .use("/teamHR/api/v1/shift/", shiftRouter)
  .use("/teamHR/api/v1/category", categoryRouter)
  .use("/teamHR/api/v1/subCategory", subCategoryRouter)
  .use("/teamHR/api/v1/request", requestRouter)
  .use("/teamHR/api/v1/contract", contractRouter)
  .use("/teamHR/api/v1/payroll", payrollRouter)
  .use("/teamHR/api/v1/task", taskRouter)
  .use("/teamHR/api/v1/subtask", subtaskRouter)
  .use("/teamHR/api/v1/break", breakRouter)
  .use("/teamHR/api/v1/over", overTimeRouter)
  .use("/teamHR/api/v1/attendance", attendRouter)
  .use("/teamHR/api/v1/blog", blogsRouter)
  .use("/teamHR/api/v1/comment", commentRouter)
  .use("/teamHR/api/v1/rate", rateRouter)
  .use("/teamHR/api/v1/notification", notifsRouter)
  .use("/teamHR/api/v1/document", documentRouter)
  .use("/teamHR/api/v1/post", postRouter)
  .use("/teamHR/api/v1/services", servicesRouter)
  .use("/uploads", express.static("./uploads"))
  .post("/teamHR/api/v1/upload", upload.single("image"), (req, res) => {
    res.status(200).send({ filename: req.file?.filename });
  })
  .all("*", (req: Request, res: Response) =>
    res.status(404)
      .send({ message: "Undefined Route" }),
  );

export default app;
