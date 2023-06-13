import { Roles } from "../../types/enums";
import { AuthenticatedReq } from "../../middlewares/auth";
import { IBreak } from "../../models/break";
import { Response, Request, NextFunction } from "express";
import { Break } from "../../models/break";
import User from "../../models/user";
//@desc         create a breakTime
//@route        POST /api/v1/break
//@access       private(root,admin)
export const addBreak = async (req: Request, res: Response) =>
{
    const empBreak = new Break({
        ...req.body,
    });
    await empBreak.save();
    res.send({
        success: true,
        data: empBreak,
        message_en: "Break created successfully",
    });
};
//@desc         get all breaks in shift
//@route        GET /api/v1/break/:shift
//@access       private(root,admin)
export const getAllBreaks = async (req: AuthenticatedReq, res: Response) =>
{
    let breaks;
    const user: any = req.user;
    if (user.role === Roles.EMPLOYEE) {
        breaks = await Break.find({
            shift: req.user?.shift,
        }).populate("users shift");
    } else {
        breaks = await Break.find({ shift: req.params.shift }).populate("users shift");
    }

    if (!breaks) {
        return res.status(400).send({
            error_en: "Invalid shift !! , can't get the breaks from the shift ",
        });
    }
    res.send({
        success: true,
        data: breaks,
        message_en: "Breaks are fetched successfully",
    });
};
//@desc         update a breakTime
//@route        PUT /api/v1/break/:shift/:id
//@access       private(root,admin)
export const updateBreak = async (req: Request, res: Response) =>
{
    const {
        start,
        end,
        duration,
        isOpen,
    } = req.body;
    const bk = await Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!bk) {
        return res.status(400).send({ error_en: "Invalid break !!" });
    }
    // if you want just update the start and the end for break
    if (!isOpen && !bk.isOpen) {
        await Break.updateOne(
            {
                shift: req.params.shift,
                _id: req.params.id,
            },
            {
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
            },
        );
    }
    // if you want to make the break open so will update isOpen and update duration for break
    else if (isOpen && !bk.isOpen) {
        await Break.updateOne(
            {
                shift: req.params.shift,
                _id: req.params.id,
            },
            {
                $set: {
                    isOpen: isOpen,
                    duration: {
                        hours: duration.hours ? duration.hours : bk.duration.hours,
                        mins: duration.mins ? duration.mins : bk.duration.mins,
                    },
                    start: null,
                    end: null,
                },
            },
        );
    }
    // if you want to make the break specific time so will update isOpen and update start and end for break
    else if (isOpen === false && bk.isOpen) {
        await Break.updateOne(
            {
                shift: req.params.shift,
                _id: req.params.id,
            },
            {
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
            },
        );
    }
    //if you want to just update the duration for break
    else if (isOpen && bk.isOpen) {
        await Break.updateOne(
            {
                shift: req.params.shift,
                _id: req.params.id,
            },
            {
                $set: {
                    isOpen: isOpen,
                    duration: {
                        hours: duration.hours ? duration.hours : bk.duration.hours,
                        mins: duration.mins ? duration.mins : bk.duration.mins,
                    },
                },
            },
        );
    }
    const newBreak = await Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    res.send({
        success: true,
        data: newBreak,
        message_en: "Break updated successfully",
    });
};
//@desc         get a breakDetails in shift
//@route        GET /api/v1/break/:shift/:id
//@access       private(root,admin)
export const getBreakById = async (req: Request, res: Response) =>
{
    const userBreak: any = await Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    }).populate("users shift");
    if (!userBreak) {
        return res.status(400).send({ error_en: "Invalid break !!" });
    }
    res.send({
        success: true,
        data: userBreak,
        message_en: "Break fetched successfully",
    });
};
//@desc         delete a break in shift
//@route        DELETE /api/v1/break/:shift/:id
//@access       private(root,admin)
export const deleteBreakById = async (req: Request, res: Response) =>
{
    const bk: any = await Break.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!bk) {
        return res.status(400).send({ error_en: "Invalid break !!" });
    }
    await Break.deleteOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    res.send({
        success: true,
        message_en: "Break deleted successfully",
    });
};
//@desc         Assign user to Break
//@route        POST /api/v1/break/assign/:shift/:id
//@access       private(root,admin)
export const assignUser = async (req: Request, res: Response) =>
{
    const userId = req.body.userId;
    let user: any;
    if (userId) {
        user = await User.find({ _id: userId });
    }
    if (!user[0]) {
        return res
            .status(400)
            .send({ error_en: "User you are trying to assign to is not available" });
    }
    const userBreak = await Break.findById({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!userBreak) {
        return res.status(400).send({ error_en: "Create break shift first" });
    }
    const assignedBreak = await Break.find({
        users: { $elemMatch: { $in: userId } },
        $or: [
            {
                $and: [
                    { start: { $gte: userBreak.start } },
                    { end: { $lte: userBreak.end } },
                ],
            },
            {
                $and: [
                    { start: { $lte: userBreak.start } },
                    { end: { $gte: userBreak.end } },
                ],
            },
            {
                $and: [
                    { start: { $lte: userBreak.start } },
                    { end: { $gt: userBreak.start } },
                ],
            },
            { $and: [ { start: { $lt: userBreak.end } }, { end: { $gte: userBreak.end } } ] },
        ],
    });
    const assignedBreakOpen = await Break.find({
        users: { $elemMatch: { $in: userId } },
    });
    console.log(assignedBreakOpen);
    console.log(assignedBreak);


    if (assignedBreak[0] || assignedBreakOpen[0]) {
        return res
            .status(400)
            .send({ error_en: "user already signed in another break in the selected time" });
    }
    const foundBreak = await Break.findByIdAndUpdate(
        {
            shift: req.params.shift,
            _id: req.params.id,
        },
        { $push: { users: userId } },
        { new: true },
    );
    res.send({
        success: true,
        date: foundBreak,
        message_en: "User assigned to break successfully",
    });
};
//@desc         Unassign user from Break
//@route        POST /api/v1/break/unassign/:shift/:id
//@access       private(root,admin)
//a7a ya abdo you should un assign all the users if you want to 
export const unassignUser = async (req: Request, res: Response) =>
{
    const unAssignUsers = await User.find({ _id: { $in: req.body.to } });
    if (!unAssignUsers[0]) {
        return res
            .status(400)
            .send("User you are trying to unassign to is not available");
    }

    const foundBreak = await Break.updateOne(
        { _id: req.params.id },
        { $pull: { users: { $in: unAssignUsers } } },
        {
            multi: true,
            new: true,
        },
    );
    if (!foundBreak) {
        return res.status(400).send("Create Break shift first");
    }
    res.send({
        success: true,
        date: foundBreak,
        message_en: "User unassign from break successfully",
    });
};
