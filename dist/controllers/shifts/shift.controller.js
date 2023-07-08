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
exports.addWorkDays = exports.addHolidays = exports.getShift = exports.getAllShifts = exports.deleteShift = exports.updateShift = exports.addShift = void 0;
const attendenc_model_1 = require("./../../models/attendenc.model");
const enums_1 = require("./../../types/enums");
const Shift_1 = require("../../models/Shift");
const enums_2 = require("../../types/enums");
const User_1 = __importDefault(require("../../models/User"));
const OverTime_1 = require("../../models/OverTime");
const Break_1 = require("../../models/Break");
const payrol_1 = __importDefault(require("../../models/payrol"));
//@desc         create a shift
//@route        POST /api/v1/shift
//@access       private(root,admin)
const addShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, branch, time, start_day, end_day, allows } = req.body;
    // time.start_hour = time.start_hour && time.start_hour -2
    // time.end_hour = time.end_hour && time.end_hour -2
    //II:must the shift be unique in the selected branch
    const uniqueShift = yield Shift_1.Shift.findOne({ branch: branch, name: name });
    if (uniqueShift)
        return res
            .status(400)
            .send({ error_en: 'The shift with the given NAME used befor' });
    const shift = new Shift_1.Shift({
        name: name,
        branch: branch,
        time: {
            start_hour: time.start_hour,
            end_hour: time.end_hour,
        },
        allows: {
            lateTime: {
                hours: allows.lateTime.hours,
                mins: allows.lateTime.mins,
            },
            leavingTime: {
                hours: allows.leavingTime.hours,
                mins: allows.leavingTime.mins,
            },
        },
        start_day: start_day,
        end_day: end_day,
    });
    shift.save();
    res.send({
        success: true,
        data: shift,
        message_en: 'Shift is created successfully',
    });
});
exports.addShift = addShift;
//@desc         update a shift
//@route        put /api/v1/shift/:branch/:id
//@access       private(root,admin)
const updateShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, time, start_day, end_day, allows } = req.body;
    const branchId = req.params.branch;
    const shiftId = req.params.id;
    const shift = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    const weeklyHolidays = [];
    const origianalDays = [];
    const TheStartDay = start_day ? start_day : shift.start_day;
    const TheEndDay = end_day ? end_day : shift.end_day;
    for (let index = TheEndDay; index >= TheStartDay; index--) {
        origianalDays.push(index);
    }
    for (let index = 0; index < enums_1.days.length; index++) {
        const day = enums_1.days[index];
        if (!origianalDays.includes(day)) {
            weeklyHolidays.push(day);
        }
    }
    if (!shift)
        return res.status(400).send({ error_en: 'Invaild shift !!' });
    const originalTime = {
        hours: (time ? time.end_hour : shift.time.end_hour) -
            (time ? time.start_hour : shift.time.start_hour),
        mins: (time ? time.end_mins : shift.time.end_mins) -
            (time ? time.start_mins : shift.time.start_mins),
    };
    // (time ? time.end_mins : shift.time.end_hour) -
    // (time ? time.start_hour : shift.time.start_hour)
    const uniqueShift = yield Shift_1.Shift.findOne({
        _id: { $ne: shiftId },
        branch: branchId,
        name: name,
    });
    if (uniqueShift)
        return res
            .status(400)
            .send({ error_en: 'The shift with the given NAME used befor' });
    yield Shift_1.Shift.updateOne({ branch: branchId, _id: shiftId }, Object.assign(Object.assign({}, req.body), { allows: Object.assign(Object.assign({}, allows), { weeklyHolidays: weeklyHolidays }), origianalDays: origianalDays, time: {
            originalTime: time ? originalTime : shift.time.originalTime,
            start_hour: time && time.start_hour ? time.start_hour : shift.time.start_hour,
            end_hour: time && time.end_hour ? time.end_hour : shift.time.end_hour,
            start_mins: time && time.start_mins ? time.start_mins : shift.time.start_mins,
            end_mins: time && time.end_mins ? time.end_mins : shift.time.end_mins,
        } }), { new: true });
    const newS = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    res.send({
        success: true,
        data: newS,
        message_en: 'Shift is updated successfully',
    });
});
exports.updateShift = updateShift;
//@desc         delete a shift
//@route        DELETE /api/v1/shift/:branch/:id
//@access       private(root,admin)
const deleteShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branchId = req.params.branch;
    const shiftId = req.params.id;
    const shift = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    if (!shift)
        return res.status(400).send({ error_en: 'Invaild shift !!' });
    yield User_1.default.updateMany({ shift: shiftId }, {
        $set: {
            shift: null,
        },
    });
    console.log('shiftId: ', shiftId);
    yield Shift_1.Shift.deleteOne({ _id: shiftId });
    yield OverTime_1.Overtime.deleteMany({ shift: shiftId });
    yield Break_1.Break.deleteMany({ shift: shiftId });
    yield attendenc_model_1.Attendance.updateMany({ shift: shiftId }, {
        $set: {
            shift: null,
        },
    });
    yield payrol_1.default.updateMany({ shift: shiftId }, {
        $set: {
            shift: null,
        },
    });
    res.send({
        success: true,
        message_en: 'Shift  deleted successfully',
    });
});
exports.deleteShift = deleteShift;
//@desc         get all shifts in branch
//@route        GET /api/v1/shift/:branch
//@access       private(root,admin)
const getAllShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const branchId = req.params.branch;
    const user = req.user;
    console.log('reShift: ', (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.shift);
    let shifts;
    if (user.role === enums_1.Roles.EMPLOYEE) {
        shifts = yield Shift_1.Shift.find({
            branch: (_b = req.user) === null || _b === void 0 ? void 0 : _b.branch,
            _id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.shift,
        });
    }
    else {
        shifts = yield Shift_1.Shift.find({ branch: branchId });
    }
    res.send({
        success: true,
        data: shifts,
        message_en: 'shifts are fetched successfully',
    });
});
exports.getAllShifts = getAllShifts;
//@desc         get a shift
//@route        GET /api/v1/shift/:branch/:name
//@access       private(root,admin)
const getShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branchId = req.params.branch;
    const shiftId = req.params.id;
    let shift;
    shift = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    if (!shift)
        return res.status(400).send({ error_en: 'Invaild shift !!' });
    res.send({
        success: true,
        data: shift,
        message_en: 'Shift is fetched successfully',
    });
});
exports.getShift = getShift;
//@desc         add weeklyHolidays in shift
//@route        POST /api/v1/shift/holidays/:branch/:name
//@access       private(root,admin)
const addHolidays = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const branchId = req.params.branch;
    const shiftId = req.params.id;
    const { weeklyHolidays } = req.body;
    // if the shift invaild
    const shift = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    if (!shift)
        return res.status(400).send({ error_en: 'Invaild shift !!' });
    // if the any day of day already exist
    for (let index = 0; index < weeklyHolidays.length; index++) {
        const day = weeklyHolidays[index];
        const holidy = yield Shift_1.Shift.findOne({
            branch: branchId,
            _id: shiftId,
            weeklyHolidays: { $elemMatch: { $eq: day } },
        });
        if (holidy) {
            index = weeklyHolidays.length - 1;
            return res
                .status(400)
                .send({ error_en: `The Day :${enums_2.nameDays[day]} is Already Exist` });
        }
    }
    // update holidays
    const upateHolidys = {
        $push: {
            weeklyHolidays: weeklyHolidays.map((day) => {
                return day;
            }),
        },
        $pull: {
            origianalDays: weeklyHolidays.map((day) => {
                return day;
            }),
        },
    };
    yield Shift_1.Shift.updateOne({ branch: branchId, _id: shiftId }, upateHolidys);
    const newHolid = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    res.send({
        success: true,
        data: newHolid === null || newHolid === void 0 ? void 0 : newHolid.weeklyHolidays,
        message_en: 'Holidays are updated successfully',
    });
});
exports.addHolidays = addHolidays;
//@desc         add weeklyWorkDays in shift
//@route        POST /api/v1/shift/workdays/:branch/:name
//@access       private(root,admin)
const addWorkDays = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const branchId = req.params.branch;
    const shiftId = req.params.id;
    const { origianalDays } = req.body;
    // if the shift invaild
    const shift = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    if (!shift)
        return res.status(400).send({ error_en: 'Invaild shift !!' });
    // if the any day of days already exist
    for (let index = 0; index < origianalDays.length; index++) {
        const day = origianalDays[index];
        const holidy = yield Shift_1.Shift.findOne({
            branch: branchId,
            _id: shiftId,
            origianalDays: { $elemMatch: { $eq: day } },
        });
        if (holidy) {
            index = origianalDays.length - 1;
            return res
                .status(400)
                .send({ error_en: `The Day :${enums_2.nameDays[day]} is Already Exist` });
        }
    }
    // update workdays
    const upateWorkDays = {
        $pull: {
            weeklyHolidays: origianalDays.map((day) => {
                return day;
            }),
        },
        $push: {
            origianalDays: origianalDays.map((day) => {
                return day;
            }),
        },
    };
    yield Shift_1.Shift.updateOne({ branch: branchId, _id: shiftId }, upateWorkDays);
    const newWorkDay = yield Shift_1.Shift.findOne({ branch: branchId, _id: shiftId });
    return res.send({
        success: true,
        data: newWorkDay === null || newWorkDay === void 0 ? void 0 : newWorkDay.origianalDays,
        message_en: 'Holidays are updated successfully',
    });
});
exports.addWorkDays = addWorkDays;
