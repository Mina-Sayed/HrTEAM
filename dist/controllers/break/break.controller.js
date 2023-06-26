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
exports.unassignUser = exports.assignUser = exports.deleteBreakById = exports.getBreakById = exports.updateBreak = exports.getAllBreaks = exports.addBreak = void 0;
const enums_1 = require("./../../types/enums");
const Break_1 = require("../../models/Break");
const User_1 = __importDefault(require("../../models/User"));
//@desc         create a breakTime
//@route        POST /api/v1/break
//@access       private(root,admin)
const addBreak = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brea = new Break_1.Break(Object.assign({}, req.body));
    yield brea.save();
    res.send({
        success: true,
        data: brea,
        message_en: 'Break created successfully',
    });
});
exports.addBreak = addBreak;
//@desc         get all breaks in shift
//@route        GET /api/v1/break/:shift
//@access       private(root,admin)
const getAllBreaks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let bks;
    const user = req.user;
    if (user.role === enums_1.Roles.EMPLOYEE) {
        bks = yield Break_1.Break.find({
            shift: (_a = req.user) === null || _a === void 0 ? void 0 : _a.shift,
        }).populate("users shift");
    }
    else {
        bks = yield Break_1.Break.find({ shift: req.params.shift }).populate('users shift');
    }
    if (!bks)
        return res.status(400).send({
            error_en: "Invalid shift !! , can't get the breaks from the shift ",
        });
    res.send({
        success: true,
        data: bks,
        message_en: 'Breaks are fetched successfully',
    });
});
exports.getAllBreaks = getAllBreaks;
//@desc         update a breakTime
//@route        PUT /api/v1/break/:shift/:id
//@access       private(root,admin)
const updateBreak = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end, duration, isOpen } = req.body;
    const bk = yield Break_1.Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!bk)
        return res.status(400).send({ error_en: 'Invalid break !!' });
    // if want just update the start and the end for break
    if (!isOpen && !bk.isOpen) {
        yield Break_1.Break.updateOne({ shift: req.params.shift, _id: req.params.id }, {
            $set: {
                start: {
                    hours: start.hours ? start.hours : bk.start.hours,
                    mins: start.mins ? start.mins : bk.start.mins,
                },
                end: {
                    hours: end.hours ? end.hours : bk.end.hours,
                    mins: end.mins ? end.mins : bk.end.mins,
                },
            },
        });
    }
    // if want make the break open so will update isOpen and update duration for break
    else if (isOpen && !bk.isOpen) {
        yield Break_1.Break.updateOne({ shift: req.params.shift, _id: req.params.id }, {
            $set: {
                isOpen: isOpen,
                duration: {
                    hours: duration.hours ? duration.hours : bk.duration.hours,
                    mins: duration.mins ? duration.mins : bk.duration.mins,
                },
                start: null,
                end: null,
            },
        });
    }
    // if want make the break specific time so will update isOpen and update start and end for break
    else if (isOpen === false && bk.isOpen) {
        yield Break_1.Break.updateOne({ shift: req.params.shift, _id: req.params.id }, {
            $set: {
                isOpen: isOpen,
                duration: null,
                start: {
                    hours: start.hours ? start.hours : bk.start.hours,
                    mins: start.mins ? start.mins : bk.start.mins,
                },
                end: {
                    hours: end.hours ? end.hours : bk.end.hours,
                    mins: end.mins ? end.mins : bk.end.mins,
                },
            },
        });
    }
    //if want just update the duration for break
    else if (isOpen && bk.isOpen) {
        yield Break_1.Break.updateOne({ shift: req.params.shift, _id: req.params.id }, {
            $set: {
                isOpen: isOpen,
                duration: {
                    hours: duration.hours ? duration.hours : bk.duration.hours,
                    mins: duration.mins ? duration.mins : bk.duration.mins,
                },
            },
        });
    }
    const newBk = yield Break_1.Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    res.send({
        success: true,
        data: newBk,
        message_en: 'Break updated successfully',
    });
});
exports.updateBreak = updateBreak;
//@desc         get a breakDetails in shift
//@route        GET /api/v1/break/:shift/:id
//@access       private(root,admin)
const getBreakById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bk = yield Break_1.Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    }).populate('users shift');
    if (!bk)
        return res.status(400).send({ error_en: 'Invalid break !!' });
    res.send({
        success: true,
        data: bk,
        message_en: 'Break fetched successfully',
    });
});
exports.getBreakById = getBreakById;
//@desc         delete a break in shift
//@route        DELETE /api/v1/break/:shift/:id
//@access       private(root,admin)
const deleteBreakById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bk = yield Break_1.Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!bk)
        return res.status(400).send({ error_en: 'Invalid break !!' });
    yield Break_1.Break.deleteOne({ shift: req.params.shift, _id: req.params.id });
    res.send({
        success: true,
        message_en: 'Break deleted successfully',
    });
});
exports.deleteBreakById = deleteBreakById;
//@desc         Assign user to Break
//@route        POST /api/v1/break/assign/:shift/:id
//@access       private(root,admin)
const assignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    let user;
    if (userId)
        user = yield User_1.default.find({ _id: userId });
    if (!user[0])
        return res
            .status(400)
            .send({ error_en: 'User you are trying to assing to is not available' });
    const breakv = yield Break_1.Break.findById({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!breakv)
        return res.status(400).send({ error_en: 'Create break shift first' });
    const assignedBreak = yield Break_1.Break.find({
        users: { $elemMatch: { $in: userId } },
        $or: [
            {
                $and: [
                    { start: { $gte: breakv.start } },
                    { end: { $lte: breakv.end } },
                ],
            },
            {
                $and: [
                    { start: { $lte: breakv.start } },
                    { end: { $gte: breakv.end } },
                ],
            },
            {
                $and: [
                    { start: { $lte: breakv.start } },
                    { end: { $gt: breakv.start } },
                ],
            },
            { $and: [{ start: { $lt: breakv.end } }, { end: { $gte: breakv.end } }] },
        ],
    });
    const assignedBreakOpen = yield Break_1.Break.find({
        users: { $elemMatch: { $in: userId } },
    });
    console.log(assignedBreakOpen);
    console.log(assignedBreak);
    if (assignedBreak[0] || assignedBreakOpen[0])
        return res
            .status(400)
            .send({ error_en: "user is already signed in another break in the selected time'" });
    const brea = yield Break_1.Break.findByIdAndUpdate({ shift: req.params.shift, _id: req.params.id }, { $push: { users: userId } }, { new: true });
    res.send({
        success: true,
        date: brea,
        message_en: 'User assigned to break successfully',
    });
});
exports.assignUser = assignUser;
//@desc         Unassign user from Break
//@route        POST /api/v1/break/unassign/:shift/:id
//@access       private(root,admin)
//a7a ya abdo you should un assign all the users if you want to 
const unassignUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const unAssignUsers = yield User_1.default.find({ _id: { $in: req.body.to } });
    if (!unAssignUsers[0])
        return res
            .status(400)
            .send('User you are trying to unassign to is not available');
    const brea = yield Break_1.Break.updateOne({ _id: req.params.id }, { $pull: { users: { $in: unAssignUsers } } }, { multi: true, new: true });
    if (!brea)
        return res.status(400).send('Create Break shift first');
    res.send({
        success: true,
        date: brea,
        message_en: 'User unassign from break successfully',
    });
});
exports.unassignUser = unassignUser;
