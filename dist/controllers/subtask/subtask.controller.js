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
exports.deleteSubTask = exports.updateSubTask = exports.addSubTask = exports.getSubTaskById = exports.getAllSubTasks = void 0;
const subTask_1 = __importDefault(require("../../models/subTask"));
//@DESc : Get All The subTasks
//@Route : GET /teamHR/api/v1/subtask
const getAllSubTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subtasks = yield subTask_1.default.find({ taks: req.params.task }).populate("recivedUser");
    if (subtasks.length <= 0)
        return res
            .status(400)
            .send({ success: false, message: 'SubTasks Are Not Found' });
    res
        .status(200)
        .send({ success: true, message: 'SubTasks fetched Succesfully', subtasks });
});
exports.getAllSubTasks = getAllSubTasks;
//@DESC : get SubTaskById
//@Route: GET /teamHR/api/v1/subtask/:id
const getSubTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTaskId = req.params.id;
    const subTask = yield subTask_1.default.findById(subTaskId).populate('task', '');
    if (!subTask)
        return res
            .status(400)
            .send({ success: false, message_en: 'subTask Not Found' });
    return res
        .status(200)
        .send({ success: 'subtask fetched Successfully', subTask });
});
exports.getSubTaskById = getSubTaskById;
//@DESC: add SubTAskById
//@Route : POST /teamHR/api/v1/subtask/
const addSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subtask = new subTask_1.default(Object.assign({}, req.body));
    yield subtask.save();
    res
        .status(200)
        .send({ success: true, message_en: 'subTask Added Successfully', subtask });
});
exports.addSubTask = addSubTask;
//@DESC : update subtask
//@Route : PUT /teamHR/api/v1/subtask/:id
const updateSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTaskId = req.params.id;
    const subTask = yield subTask_1.default.findByIdAndUpdate(subTaskId, Object.assign({}, req.body), { new: true });
    if (!subTask)
        return res
            .status(400)
            .send({ success: false, message: 'subTask not Found' });
    res
        .status(200)
        .send({ success: true, message: 'SubTask Updated Successfully', subTask });
});
exports.updateSubTask = updateSubTask;
//@DESC : Update
const deleteSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTaskId = req.params.id;
    const subTask = yield subTask_1.default.findByIdAndDelete(subTaskId);
    if (!subTask)
        return res
            .status(400)
            .send({ success: false, message_en: 'SubTask Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'subTask Deleted Successfully' });
});
exports.deleteSubTask = deleteSubTask;
