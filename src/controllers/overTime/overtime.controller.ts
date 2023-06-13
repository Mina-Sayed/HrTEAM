import { AuthenticatedReq } from "../../middlewares/auth";
import { Roles } from "../../types/enums";
import { Overtime } from "../../models/overtime";
import { Response, Request, NextFunction } from "express";
import User from "../../models/user";
import { Shift } from "../../models/shift";
//@desc         create a overTime
//@route        POST /api/v1/break
//@access       private(root,admin)
export const addOverTime = async (req: Request, res: Response) =>
{
    const brea = await Overtime.create(req.body);
    res.send({
        success: true,
        data: brea,
        message_en: "Overtime created successfully",
    });
};
//@desc         get all overtimes in shift
//@route        GET /api/v1/over/:shift
//@access       private(root,admin)
export const getAllOverTimeByShift = async (
    req: AuthenticatedReq,
    res: Response,
) =>
{
    let overTimes;
    const user: any = req.user;
    const page = parseInt(req.query.page as string) || 1; // default to page 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10; // default to limit 10 if not provided
    const skip = (page - 1) * limit;
    const options = {
        skip,
        limit,
    };
    if (user.role === Roles.EMPLOYEE) {
        overTimes = await Overtime.find(
            {
                shift: req.params.shift,
                users: { $elemMatch: { $in: user._id } },
            },
            null,
            options,
        ).populate("users");
    } else {
        overTimes = await Overtime.find(
            { shift: req.params.shift },
            null,
            options,
        ).populate("users shift");
    }

    const count = await Overtime.countDocuments({
        shift: req.params.shift,
    });

    console.log(overTimes);

    if (overTimes.length === 0) {
        return res.status(404).send({
            error_en: "Invalid shift !! , can't get the overtimes from the shift ",
        });
    }
    res.send({
        success: true,
        data: overTimes,
        count: count,
        message_en: "Overtimes fetched successfully",
    });
};

//@desc         update a overTime
//@route        PUT /api/v1/over/:shift/:id
//@access       private(root,admin)
export const updateOverTime = async (req: Request, res: Response) =>
{
    const {
        start,
        end,
    } = req.body;
    const over = await Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!over) {
        return res.status(400).send({ error_en: "Invalid OverTime !!" });
    }
    const startDate = start ? start : over.start;
    const endDate = end ? end : over.end;
    console.log(startDate >= endDate);

    if (startDate >= endDate) {
        return res
            .status(400)
            .send({ error_en: "end must be later than start  !!" });
    }

    await Overtime.updateOne(
        {
            shift: req.params.shift,
            _id: req.params.id,
        },
        {
            $set: {
                start: start ? start : over.start,
                end: end ? end : over.end,
            },
        },
    );
    const newOver = await Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    res.send({
        success: true,
        data: newOver,
        message_en: "Overtime updated successfully",
    });
};
//@desc         get a overTimeDetails in shift
//@route        GET /api/v1/over/:shift/:id
//@access       private(root,admin)
export const getOverTimeById = async (req: AuthenticatedReq, res: Response) =>
{
    let overTime: any;

    overTime = await Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    }).populate("users shift");

    if (!overTime) {
        return res.status(400).send({ error_en: "Invalid Overtime !!" });
    }
    res.send({
        success: true,
        data: overTime,
        message_en: "Overtime fetched successfully",
    });
};
//@desc         Assign user to OverTime
//@route        POST /api/v1/over/assign/:shift/:id
//@access       private(root,admin)
export const assignUser = async (req: Request, res: Response) =>
{
    const userId = req.body.userId;
    let user: any;
    if (userId) {
        user = await User.find({ _id: userId }).populate("shift");
    }

    if (!user[0]) {
        return res
            .status(400)
            .send({ error_en: "User you are trying to assing to is not available" });
    }
    const overtime = await Overtime.findOne({ _id: req.params.id });
    if (!overtime) {
        return res.status(400).send({ error_en: "Create overtime shift first" });
    }
    const assignedOvertime: any = await Overtime.find({
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
    const workingShift: any = await Shift.find({
        _id: userId,
        originalDays: { $in: overtime.start.getDay() },

        $or: [
            {
                $and: [
                    {
                        "time.start_hour": { $gte: overtime.start.getHours() },
                        "time.start_mins": { $gte: overtime.start.getMinutes() },
                    },
                    {
                        "time.end_hour": { $lte: overtime.end.getHours() },
                        "time.end_mins": { $lte: overtime.end.getMinutes() },
                    },
                ],
            },
            {
                $and: [
                    {
                        "time.start_hour": { $lte: overtime.start.getHours() },
                        "time.start_mins": { $lte: overtime.start.getMinutes() },
                    },
                    {
                        "time.end_hour": { $gte: overtime.end.getHours() },
                        "time.end_mins": { $gte: overtime.end.getMinutes() },
                    },
                ],
            },
            {
                $and: [
                    {
                        "time.start_hour": { $lte: overtime.start.getHours() },
                        "time.start_mins": { $lte: overtime.start.getMinutes() },
                    },
                    {
                        "time.end_hour": { $gt: overtime.start.getHours() },
                        "time.end_mins": { $gt: overtime.start.getMinutes() },
                    },
                ],
            },
            {
                $and: [
                    {
                        "time.start_hour": { $lt: overtime.end.getHours() },
                        "time.start_mins": { $lt: overtime.end.getMinutes() },
                    },
                    {
                        "time.end_hour": { $gte: overtime.end.getHours() },
                        "time.end_mins": { $gte: overtime.end.getMinutes() },
                    },
                ],
            },
        ],
    });

    if (workingShift[0]) {
        return res
            .status(400)
            .send({ error_en: "user is currently in his working shift" });
    }

    if (assignedOvertime[0]) {
        return res.status(400).send({
            error_en:
                "user is already signed in another overtime in the selected time",
        });
    }
    const UpdatedOverTime: any = await Overtime.findByIdAndUpdate(req.params.id,
        {
            $push: { users: userId },
        }).exec();

    return res.status(200).send({
        success: true,
        data: UpdatedOverTime.users,
        message_en: "user signed to overtime successfully",
    });
};
//@desc         Unssign user to OverTime
//@route        POST /api/v1/over/unassign/:shift/:id
//@access       private(root,admin)
export const unassignUser = async (req: Request, res: Response) =>
{
    const unAssignUsers = await User.find({ _id: { $in: req.body.userId } });
    if (!unAssignUsers[0]) {
        return res
            .status(400)
            .send("User you are trying to unassign to is not available");
    }

    // let user:any
    // if (userId) user = await User.find({_id:userId})
    // if (!user[0])
    //   return res
    //     .status(400)
    //     .send('User you are trying to assing to is not available')
    const overtime = await Overtime.findByIdAndUpdate(
        {
            _id: req.params.id,
            shift: req.params.shift,
        },
        { $pull: { users: { $in: unAssignUsers } } },
        {
            multi: true,
            new: true,
        },
    );
    console.log(overtime,
        "dddddddddddddddddddddddddd");

    if (!overtime) {
        return res.status(400).send("Create overtime shift first");
    }
    res.send({
        success: true,
        date: overtime,
        message_en: "User unassign from break successfully",
    });
};

//@desc         delete a break in shift
//@route        DELETE /api/v1/over/:shift/:id
//@access       private(root,admin)
export const deleteOvertimeById = async (req: Request, res: Response) =>
{
    const bk: any = await Overtime.findOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    if (!bk) {
        return res.status(400).send({ error_en: "Invalid break !!" });
    }
    await Overtime.deleteOne({
        shift: req.params.shift,
        _id: req.params.id,
    });
    res.send({
        success: true,
        message_en: "Over time deleted successfully",
    });
};
