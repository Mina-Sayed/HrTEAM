import {Overtime} from '../../models/overtime';
import {Break} from '../../models/break';
import {NextFunction, Response} from 'express';
import User from '../../models/user';
import {AuthenticatedReq} from '../../middlewares/auth';
import {Roles} from '../../types/enums';
import Payroll from '../../models/payroll';
import Contract from '../../models/contract';
import {Attendance} from '../../models/attendance';
import Blog from '../../models/blog';
import Request from '../../models/request';
import Task from '../../models/task';
import {Document} from '../../models/document';
import Comment from '../../models/comment';
import {Notification} from '../../models/notification';
//@desc         delete superadmin
//@route        DELETE /api/v1/users/superadmins/:id
//@access       private(super admins)
export const deleteSuperAdmin = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const deletedSuperAdmin = await User.deleteOne({
        _id: req.params.id,
        role: Roles.SUPER_ADMIN,
    });
    if (deletedSuperAdmin === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'super admin is deleted successfully',
        data: deletedSuperAdmin,
    });
};

//@desc         delete root
//@route        DELETE /api/v1/users/roots/:id
//@access       private(super admins)
export const deleteRoot = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const deletedRoot = await User.deleteOne(
        {_id: req.params.id, role: Roles.ROOT},
        {new: true},
    );
    if (deletedRoot === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'root is deleted successfully',
        data: deletedRoot,
    });
};

//@desc         delete admin
//@route        PATCH /api/v1/users/admins/:id
//@access       private(admin, root)
export const deleteAdmin = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const deletedAdmin = await User.deleteOne(
        {_id: req.params.id, role: Roles.ADMIN, company: req.user!.company},
        {new: true},
    );
    // We need to check if this admin is in the same company
    if (deletedAdmin === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });

    res.status(204).json({
        success: true,
        message: 'admin is deleted successfully',
        data: deletedAdmin,
    });
};

//@desc         delete employee
//@route        PATCH /api/v1/users/employees/:id
//@access       private(admin, root)
export const deleteEmployee = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    // const deletedEmployee = await User.deleteOne({_id: req.params.id, role: Roles.EMPLOYEE, company: req.user!.company}, {new: true});

    const user: any = req.params.id;
    await Payroll.deleteMany({employee: user});
    await Contract.deleteOne({employee: user});
    await Attendance.deleteMany({member: user});
    await Blog.deleteMany({user: user});
    await Blog.updateMany({user: user}, {
        $pull: {
            'likes.$.user': user,
            comments: {$eq: user}
        }
    });

    await Request.deleteMany({to: user});
    await Request.deleteMany({from: user});
    await Document.deleteMany({userId: user});
    await Comment.deleteMany({user: user});
    await Request.deleteMany({from: user});
    await Task.deleteMany({from: user});
    await Notification.deleteMany({employee: user});
    await Task.updateMany(
        {to: {$in: user}},
        {
            $pull: {
                to: user,
            },
        },
    );
    await Break.updateMany(
        {users: {$in: req.user}},
        {
            $pull: {
                users: user,
            },
        },
    );
    await Overtime.updateMany(
        {users: {$in: req.user}},
        {
            $pull: {
                users: user,
            },
        },
    );
    const deletedEmployee = await User.deleteOne(
        {_id: req.params.id},
        {new: true},
    );
    if (deletedEmployee === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'employee is deleted successfully',
        data: deletedEmployee,
    });
};
