import {NextFunction, Request, Response} from "express";
import User from "../../models/user";
import {AuthenticatedReq} from "../../middlewares/auth";
import {Roles} from "../../types/enums";

export const getMe = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction
) =>
{
    const userId = req.user?._id;
    const employee = await User.findOne({_id: userId}).select('-password');
    if (!employee)
        return res
            .status(404)
            .send({success: false, message: "user with this id not found"});
    return res.send({
        success: true,
        data: employee,
    });
};
export const getUser = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction
) =>
{
    const userId = req.params.id;
    const employee = await User.findOne({_id: userId}).select('-password');
    if (!employee)
        return res
            .status(404)
            .send({success: false, message: "user with this id not found"});
    return res.send({
        success: true,
        data: employee,
    });
};
