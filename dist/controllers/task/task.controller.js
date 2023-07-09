"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassginTask = exports.assginTask = exports.deleteTask = exports.updateTask = exports.addTask = exports.getTaskById = exports.getAllTasks = exports.updateForwardedTask = exports.forwardSubtasks = void 0;
const task_1 = __importDefault(require("../../models/task"));
const enums_1 = require("../../types/enums");
const subTask_1 = __importDefault(require("../../models/subTask"));
const User_1 = __importDefault(require("../../models/User"));
// @Desc : get all the tasks
// @Route : GET /teamHR/api/v1/task
const forwardSubtasks = (SendedTask) => {
    const { title, description, to, from, start, end, status, company, branch, } = SendedTask;
    const data = to.map((refTask) => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const dataREs = yield subTask_1.default.insertMany(data);
        return dataREs;
    }));
    return data;
};
exports.forwardSubtasks = forwardSubtasks;
const updateForwardedTask = (sendedTask) => {
    const { title, description, to, from, start, end, status } = sendedTask;
    to.map((refTask) => __awaiter(void 0, void 0, void 0, function* () {
        const subtask = yield subTask_1.default.find({ task: sendedTask._id }).updateMany({
            title,
            description,
            reciv: refTask,
            from: refTask.from,
            start,
            end,
            task: sendedTask._id,
        });
    }));
};
exports.updateForwardedTask = updateForwardedTask;
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
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let tasks;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'employee') {
        tasks = yield task_1.default.find({
            $or: [
                {
                    from: req.user._id,
                    to: { $in: req.user._id }
                },
                {
                    to: { $in: req.user._id }
                },
                {
                    from: req.user._id,
                },
            ],
        }).populate('to from');
    }
    // return tasksFromThe subTasks
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === enums_1.Roles.ADMIN || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === enums_1.Roles.ROOT) {
        const { company, branch } = req.query;
        const admins = (yield User_1.default.find({ company: company })).map((admin) => admin._id.toString());
        tasks = yield task_1.default.find({
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
            ],
        }).populate('to from');
    }
    if (tasks.length <= 0)
        return res.status(400).send({ success: false, message_en: 'No Task Found' });
    res.status(200).send({
        success: true,
        message_en: 'Tasks Are Fetched Successfully',
        tasks,
    });
});
exports.getAllTasks = getAllTasks;
//@DESC : get Task By Id
//@Route : Get /teamHR/api/v1/task/:id
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const task = yield task_1.default.findById(taskId);
    if (!task)
        return res.status(400).send({ success: false, message: 'Task Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Task Fetched Successfullly', task });
});
exports.getTaskById = getTaskById;
//@Desc: Add Task
//@Route : POST /teamHR/api/v1/task
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j;
    // if((req as AuthenticatedReq).user?.role !=Roles.ROOT){
    //     return res.status(400).send({success:false,message_en:`You Don't have Access to add Task`})
    // }
    const user = yield User_1.default.find({ _id: req.body.to });
    if (!user[0])
        return res.status(400).send({ error_en: 'Invalid users !!' });
    let task = [];
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) === enums_1.Roles.EMPLOYEE) {
        task = new task_1.default(Object.assign(Object.assign({}, req.body), { from: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id, company: req.user.company, branch: req.user.branch, to: req.body.to }));
    }
    if (((_f = req.user) === null || _f === void 0 ? void 0 : _f.role) === enums_1.Roles.ADMIN) {
        const { branch } = req.body;
        if (!branch)
            return res.status(400).send({ error_en: 'the branch is requierd !!' });
        task = new task_1.default(Object.assign(Object.assign({}, req.body), { from: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id, company: req.user.company, branch: branch, to: req.body.to }));
    }
    if (((_h = req.user) === null || _h === void 0 ? void 0 : _h.role) === enums_1.Roles.ROOT) {
        const { company, branch } = req.body;
        if (!company || !branch)
            return res
                .status(400)
                .send({ error_en: 'the company and the branch requierd !!' });
        task = new task_1.default(Object.assign(Object.assign({}, req.body), { from: (_j = req.user) === null || _j === void 0 ? void 0 : _j._id, company: company, branch: branch, to: req.body.to }));
    }
    //
    (0, exports.forwardSubtasks)(task);
    yield task.save();
    const subTasks = yield subTask_1.default.find({ task: task._id }).populate('task');
    res.status(200).send({
        success: true,
        message_en: 'Task is Added Successfully',
        task,
        subTasks,
    });
});
exports.addTask = addTask;
//@DESC : update Task
//@Route : PUT /teamHR/api/v1/task/:id
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const task = yield task_1.default.findByIdAndUpdate(taskId, Object.assign(Object.assign({}, req.body), { status: req.body.status == 'in progress' ? 'completed' : 'in progress' }), { new: true });
    (0, exports.updateForwardedTask)(task);
    if (!task)
        return res
            .status(400)
            .send({ success: false, message_en: 'Task is Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Task updated Successfully', task });
});
exports.updateTask = updateTask;
//@DESC : delete Task ById
//Route : DELETE /teamHR/api/v1/task/:id
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('reqParamsOnDelete: ', req.params.id);
    const TaskId = req.params.id;
    console.log(TaskId);
    const task = yield task_1.default.findByIdAndRemove(TaskId);
    if (!task)
        return res
            .status(400)
            .send({ success: false, message_en: 'Task Not Found' });
    yield subTask_1.default.deleteMany({ task: TaskId });
    res
        .status(200)
        .send({ success: true, message_en: 'Task Deleted Successfully' });
});
exports.deleteTask = deleteTask;
//@DESC : assgin user to Task
//@Route : PUT /teamHR/api/v1/task/assgin/:id
const assginTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const user = yield User_1.default.findOne({ _id: req.body.to });
    if (!user)
        return res.status(400).send({ error_en: 'Invalid user !!' });
    const checkTaks = yield task_1.default.findOne({
        _id: taskId,
        to: { $elemMatch: { $in: req.body.to } },
    });
    if (checkTaks)
        return res.status(400).send({ error_en: 'user already assgin to the task' });
    const task = yield task_1.default.findByIdAndUpdate(taskId, {
        $push: {
            to: req.body.to,
        },
    }, { new: true });
    (0, exports.forwardSubtasks)(task);
    if (!task)
        return res
            .status(400)
            .send({ success: false, message_en: 'Task is Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Task updated Successfully', task });
});
exports.assginTask = assginTask;
//@DESC : unassgin user to Task
//@Route : PUT /teamHR/api/v1/task/unassgin/:id
const unassginTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const user = yield User_1.default.findOne({ _id: req.body.to });
    if (!user)
        return res.status(400).send({ error_en: 'Invalid user !!' });
    const task = yield task_1.default.findByIdAndUpdate(taskId, {
        $pull: {
            to: { $in: req.body.to },
        },
    }, { new: true });
    yield subTask_1.default.deleteMany({ recivedUser: req.body.to });
    if (!task)
        return res
            .status(400)
            .send({ success: false, message_en: 'Task is Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Task updated Successfully', task });
});
exports.unassginTask = unassginTask;
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
