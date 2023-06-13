import { AuthenticatedReq } from "../../middlewares/auth";
import { Response, NextFunction } from "express";
import Task, { ITask } from "../../models/task";
import { Roles } from "../../types/enums";
import Subtask from "../../models/subtask";
import User from "../../models/user";
import mongoose, { ObjectId } from "mongoose";
import { Branch } from "../../models/branch";
import { Company } from "../../models/company";
// @Desc : get all the tasks
// @Route : GET /teamHR/api/v1/task

export const forwardSubtasks = (SentTask: any) =>
{
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
    } = SentTask;
    const data = to.map(async (refTask: any) =>
    {
        const data = {
            title,
            description,
            receivedUser: refTask,
            from: SentTask.from,
            start,
            branch,
            company,
            end,
            task: SentTask._id,
        };
        const dataREs = await Subtask.insertMany(data);
        return dataREs;
    });
    return data;
};
export const updateForwardedTask = (sentTask: any) =>
{
    const {
        title,
        description,
        to,
        from,
        start,
        end,
        status,
    } = sentTask;
    to.map(async (refTask: any) =>
    {
        const subtask = await Subtask.find({ task: sentTask._id }).updateMany({
            title,
            description,
            received: refTask,
            from: refTask.from,
            start,
            end,
            task: sentTask._id,
        });
    });
};
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
//     tasks = await Subtask.find({
//       from: req.user._id,
//     }).populate('task receivedUser from')
//   }
// }
export const getAllTasks = async (req: AuthenticatedReq, res: Response) =>
{
    const page = parseInt(req.query.page as string) || 1; // page number, default is 1
    const limit = parseInt(req.query.limit as string) || 10; // number of tasks per page, default is 10
    const startIndex = (page - 1) * limit;

    let tasks: ITask[] | null = null;
    if (req.user?.role === "employee") {
        tasks = await Task.find({
            $or: [
                {
                    from: req.user._id,
                    to: { $in: req.user._id },
                },
                {
                    to: { $in: req.user._id },
                },
                {
                    from: req.user._id,
                },
            ],
        })
            .populate("to from")
            .skip(startIndex)
            .limit(limit);
    } else if (req.user?.role === Roles.ADMIN || req.user?.role === Roles.ROOT) {
        const {
            company,
            branch,
        } = req.query;
        // (await User.find({ company: company })).map((admin) =>
        //     admin._id.toString(),
        // );
        tasks = await Task.find({
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
            ],
        })
            .populate("to from")
            .skip(startIndex)
            .limit(limit);
    }

    if (!tasks || tasks.length <= 0) {
        return res.status(400).send({
            success: false,
            message_en: "No Task Found",
        });
    }

    res.status(200).send({
        success: true,
        message_en: "Tasks Are Fetched Successfully",
        tasks: tasks,
    });
};


//@DESC : get Task By Id
//@Route : Get /teamHR/api/v1/task/:id
export const getTaskById = async (req: AuthenticatedReq, res: Response) =>
{
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).send({
            success: false,
            message: "Task Not Found",
        });
    }
    return res
        .status(200)
        .send({
            success: true,
            message_en: "Task Fetched Successfully",
            task: task,
        });
};

//@Desc: Add Task
//@Route : POST /teamHR/api/v1/task
export const addTask = async (req: AuthenticatedReq, res: Response) =>
{
    // if((req as AuthenticatedReq).user?.role !=Roles.ROOT){
    //     return res.status(400).send({success:false,message_en:`You Don't have Access to add Task`})
    // }
    const user = await User.find({ _id: req.body.to });
    if (!user[0]) {
        return res.status(404).send({ error_en: "Invalid users !" });
    }
    let task: any = [];
    if (req.user?.role === Roles.EMPLOYEE) {
        task = new Task({
            ...req.body,
            from: req.user?._id,
            company: req.user.company,
            branch: req.user.branch,
            to: req.body.to,
        });
    }
    if (req.user?.role === Roles.ADMIN) {
        const { branch } = req.body;
        if (!branch) {
            return res.status(400).send({ error_en: "Branch id is required !" });
        }
        task = new Task({
            ...req.body,
            from: req.user?._id,
            company: req.user.company,
            branch: branch,
            to: req.body.to,
        });
    }
    if (req.user?.role === Roles.ROOT) {
        const {
            company,
            branch,
        } = req.body;
        if (!company || !branch) {
            return res
                .status(400)
                .send({ error_en: "company and the branch required !" });
        }
        task = new Task({
            ...req.body,
            from: req.user?._id,
            company: company,
            branch: branch,
            to: req.body.to,
        });
    }
    //

    forwardSubtasks(task);
    await task.save();
    const subTasks = await Subtask.find({ task: task._id }).populate("task");
    res.status(200).send({
        success: true,
        message_en: "Task is Added Successfully",
        task: task,
        subTasks: subTasks,
    });
};
//@DESC : update Task
//@Route : PUT /teamHR/api/v1/task/:id
export const updateTask = async (req: AuthenticatedReq, res: Response) =>
{
    const taskId = req.params.id;
    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            ...req.body,
            status: req.body.status == "in progress" ? "completed" : "in progress",
        },
        { new: true },
    );
    updateForwardedTask(task);
    if (!task) {
        return res
            .status(404)
            .send({
                success: false,
                message_en: "Task is Not Found",
            });
    }
    res
        .status(200)
        .send({
            success: true,
            message_en: "Task updated Successfully",
            task: task,
        });
};
//@DESC : delete Task ById
//Route : DELETE /teamHR/api/v1/task/:id
export const deleteTask = async (req: AuthenticatedReq, res: Response) =>
{
    console.log("reqParamsOnDelete: ",
        req.params.id);
    const TaskId = req.params.id;
    console.log(TaskId);
    const task = await Task.findByIdAndRemove(TaskId);
    if (!task) {
        return res
            .status(404)
            .send({
                success: false,
                message_en: "Task Not Found",
            });
    }
    await Subtask.deleteMany({ task: TaskId });

    res
        .status(200)
        .send({
            success: true,
            message_en: "Task Deleted Successfully",
        });
};

//@DESC : assgin user to Task
//@Route : PUT /teamHR/api/v1/task/assgin/:id
export const assignTask = async (req: AuthenticatedReq, res: Response) =>
{
    const taskId = req.params.id;
    const user = await User.findOne({ _id: req.body.to });
    if (!user) {
        return res.status(400).send({ error_en: "Invalid user !" });
    }
    const checkTask = await Task.findOne({
        _id: taskId,
        to: { $elemMatch: { $in: req.body.to } },
    });
    if (checkTask) {
        return res.status(400).send({ error_en: "user already assigned to the task" });
    }
    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            $push: {
                to: req.body.to,
            },
        },
        { new: true },
    );
    forwardSubtasks(task);
    if (!task) {
        return res
            .status(404)
            .send({
                success: false,
                message_en: "Task not found",
            });
    }
    res
        .status(200)
        .send({
            success: true,
            message_en: "Task updated successfully",
            task,
        });
};
/*
@Desc : unassign user to Task
@Route : PUT /teamHR/api/v1/task/unassign/:id
 */
export const unassignTask = async (req: AuthenticatedReq, res: Response) =>
{
    const taskId = req.params.id;
    const user = await User.findOne({ _id: req.body.to });
    if (!user) {
        return res.status(400).send({ error_en: "Invalid user !" });
    }

    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            $pull: {
                to: { $in: req.body.to },
            },
        },
        { new: true },
    );
    await Subtask.deleteMany({ receivedUser: req.body.to });
    if (!task) {
        return res
            .status(404)
            .send({
                success: false,
                message_en: "Task is Not Found",
            });
    }
    res
        .status(200)
        .send({
            success: true,
            message_en: "Task updated Successfully",
            task,
        });
};
// let sortTasks: any = {}

// for (let index = 0; index < tasksCom.length; index++) {
//   let task: any = tasksCom[index]
//   let subTask = await Subtask.find({ task: task._id.toString()})
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
