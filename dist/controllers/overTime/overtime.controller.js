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
exports.deleteOvertimeById = exports.unassignUser = exports.assginUser = exports.getOverTimeById = exports.updateOverTime = exports.getAllOverTimeByShift = exports.addOverTime = void 0;
const enums_1 = require("./../../types/enums");
const OverTime_1 = require("../../models/OverTime");
const User_1 = __importDefault(require("../../models/User"));
const Shift_1 = require("../../models/Shift");
//@desc         create a overTime
//@route        POST /api/v1/break
//@access       private(root,admin)
const addOverTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brea = yield OverTime_1.Overtime.create(req.body);
    res.send({
        success: true,
        data: brea,
        message_en: 'Overtime created successfully',
    });
});
exports.addOverTime = addOverTime;
//@desc         get all overtimes in shift
//@route        GET /api/v1/over/:shift
//@access       private(root,admin)
const getAllOverTimeByShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ovts;
    const user = req.user;
    if (user.role === enums_1.Roles.EMPLOYEE) {
        ovts = yield OverTime_1.Overtime.find({
            shift: req.params.shift,
            users: { $elemMatch: { $in: user._id } },
        }).populate('users');
    }
    else {
        ovts = yield OverTime_1.Overtime.find({ shift: req.params.shift }).populate('users shift');
    }
    console.log(ovts);
    if (!ovts)
        return res.status(400).send({
            error_en: "Invalid shift !! , can't get the overtimes from the shift ",
        });
    res.send({
        success: true,
        data: ovts,
        message_en: 'Overtimes fetched successfully',
    });
});
exports.getAllOverTimeByShift = getAllOverTimeByShift;
//@desc         update a overTime
//@route        PUT /api/v1/over/:shift/:id
//@access       private(root,admin)
const updateOverTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end } = req.body;
    const over = yield OverTime_1.Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!over)
        return res.status(400).send({ error_en: 'Invalid OverTime !!' });
    const startDate = start ? start : over.start;
    const endDate = end ? end : over.end;
    console.log(startDate >= endDate);
    if (startDate >= endDate)
        return res
            .status(400)
            .send({ error_en: 'end must be later than start  !!' });
    yield OverTime_1.Overtime.updateOne({ shift: req.params.shift, _id: req.params.id }, {
        $set: {
            start: start ? start : over.start,
            end: end ? end : over.end,
        },
    });
    const newOver = yield OverTime_1.Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    res.send({
        success: true,
        data: newOver,
        message_en: 'Overtime updated successfully',
    });
});
exports.updateOverTime = updateOverTime;
//@desc         get a overTimeDetails in shift
//@route        GET /api/v1/over/:shift/:id
//@access       private(root,admin)
const getOverTimeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let overTime;
    overTime = yield OverTime_1.Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    }).populate('users shift');
    if (!overTime)
        return res.status(400).send({ error_en: 'Invalid Overtime !!' });
    res.send({
        success: true,
        data: overTime,
        message_en: 'Overtime fetched successfully',
    });
});
exports.getOverTimeById = getOverTimeById;
//@desc         Assign user to OverTime
//@route        POST /api/v1/over/assign/:shift/:id
//@access       private(root,admin)
const assginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    let user;
    if (userId)
        user = yield User_1.default.find({ _id: userId }).populate('shift');
    if (!user[0])
        return res
            .status(400)
            .send({ error_en: 'User you are trying to assing to is not available' });
    const overtime = yield OverTime_1.Overtime.findOne({ _id: req.params.id });
    if (!overtime)
        return res.status(400).send({ error_en: 'Create overtime shift first' });
    const assignedOvertime = yield OverTime_1.Overtime.find({
        shift: req.params.shift,
        _id: req.params.id,
        users: { $elemMatch: { $in: userId } },
        $or: [
            {
                $and: [
                    { start: { $gte: overtime.start } },
                    { end: { $lte: overtime.end } },
                ],
            },
            {
                $and: [
                    { start: { $lte: overtime.start } },
                    { end: { $gte: overtime.end } },
                ],
            },
            {
                $and: [
                    { start: { $lte: overtime.start } },
                    { end: { $gt: overtime.start } },
                ],
            },
            {
                $and: [
                    { start: { $lt: overtime.end } },
                    { end: { $gte: overtime.end } },
                ],
            },
        ],
    });
    const workingShift = yield Shift_1.Shift.find({
        _id: userId,
        origianalDays: { $in: overtime.start.getDay() },
        $or: [
            {
                $and: [
                    {
                        'time.start_hour': { $gte: overtime.start.getHours() },
                        'time.start_mins': { $gte: overtime.start.getMinutes() },
                    },
                    {
                        'time.end_hour': { $lte: overtime.end.getHours() },
                        'time.end_mins': { $lte: overtime.end.getMinutes() },
                    },
                ],
            },
            {
                $and: [
                    {
                        'time.start_hour': { $lte: overtime.start.getHours() },
                        'time.start_mins': { $lte: overtime.start.getMinutes() },
                    },
                    {
                        'time.end_hour': { $gte: overtime.end.getHours() },
                        'time.end_mins': { $gte: overtime.end.getMinutes() },
                    },
                ],
            },
            {
                $and: [
                    {
                        'time.start_hour': { $lte: overtime.start.getHours() },
                        'time.start_mins': { $lte: overtime.start.getMinutes() },
                    },
                    {
                        'time.end_hour': { $gt: overtime.start.getHours() },
                        'time.end_mins': { $gt: overtime.start.getMinutes() },
                    },
                ],
            },
            {
                $and: [
                    {
                        'time.start_hour': { $lt: overtime.end.getHours() },
                        'time.start_mins': { $lt: overtime.end.getMinutes() },
                    },
                    {
                        'time.end_hour': { $gte: overtime.end.getHours() },
                        'time.end_mins': { $gte: overtime.end.getMinutes() },
                    },
                ],
            },
        ],
    });
    if (workingShift[0])
        return res
            .status(400)
            .send({ error_en: 'user is currently in his working shift' });
    if (assignedOvertime[0])
        return res.status(400).send({
            error_en: 'user is already signed in another overtime in the selected time',
        });
    const UpdatedOverTime = yield OverTime_1.Overtime.findByIdAndUpdate(req.params.id, {
        $push: { users: userId },
    }).exec();
    return res.status(200).send({
        success: true,
        data: UpdatedOverTime.users,
        message_en: 'user signed to overtime successfully',
    });
});
exports.assginUser = assginUser;
//@desc         Unssign user to OverTime
//@route        POST /api/v1/over/unassign/:shift/:id
//@access       private(root,admin)
const unassignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const unAssignUsers = yield User_1.default.find({ _id: { $in: req.body.userId } });
    if (!unAssignUsers[0])
        return res
            .status(400)
            .send('User you are trying to unassign to is not available');
    // let user:any
    // if (userId) user = await User.find({_id:userId})
    // if (!user[0])
    //   return res
    //     .status(400)
    //     .send('User you are trying to assing to is not available')
    const overtime = yield OverTime_1.Overtime.findByIdAndUpdate({ _id: req.params.id, shift: req.params.shift }, { $pull: { users: { $in: unAssignUsers } } }, { multi: true, new: true });
    console.log(overtime, 'dddddddddddddddddddddddddd');
    if (!overtime)
        return res.status(400).send('Create overtime shift first');
    res.send({
        success: true,
        date: overtime,
        message_en: 'User unassign from break successfully',
    });
});
exports.unassignUser = unassignUser;
//@desc         delete a break in shift
//@route        DELETE /api/v1/over/:shift/:id
//@access       private(root,admin)
const deleteOvertimeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bk = yield OverTime_1.Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!bk)
        return res.status(400).send({ error_en: 'Invalid break !!' });
    yield OverTime_1.Overtime.deleteOne({ shift: req.params.shift, _id: req.params.id });
    res.send({
        success: true,
        message_en: 'Over time deleted successfully',
    });
});
exports.deleteOvertimeById = deleteOvertimeById;
