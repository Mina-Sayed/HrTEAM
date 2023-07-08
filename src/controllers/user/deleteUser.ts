import { Overtime } from './../../models/OverTime'
import { Break } from './../../models/Break'
import { NextFunction, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Roles } from '../../types/enums'
import Payrol from '../../models/payrol'
import Contract from '../../models/Contract'
import { Attendance } from '../../models/attendenc.model'
import Blog from '../../models/blog.model'
import Request from '../../models/Request'
import Task from '../../models/task'
import { Document } from '../../models/Documents'
import Comment from '../../models/comment.model'
import { Notification } from '../../models/notification.model'
//@desc         delete superadmin
//@route        DELETE /api/v1/users/superadmins/:id
//@access       private(super admins)
export const deleteSuperAdmin = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const deletedSuperAdmin = await User.deleteOne({
    _id: req.params.id,
    role: Roles.SUPER_ADMIN,
  })
  if (deletedSuperAdmin === null)
    return res.status(400).send({
      success: false,
      message: 'user not found',
    })
  res.status(204).json({
    success: true,
    message: 'super admin is deleted successfully',
    data: deletedSuperAdmin,
  })
}
// -----------------------------------
//@desc         delete user
//@route        DELETE /api/v1/user/:id
//@access       private(super admins)
export const deleteUser = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const deletedUser = await User.deleteOne({
    _id: req.params.id,
    role: Roles.USER,
  })
 
  res.status(204).send({
    success: true,
    message: 'User is deleted successfully',
  })
}
// --------------------------------------



//@desc         delete root
//@route        DELETE /api/v1/users/roots/:id
//@access       private(super admins)
export const deleteRoot = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const deletedRoot = await User.deleteOne(
    { _id: req.params.id, role: Roles.ROOT },
    { new: true },
  )
  if (deletedRoot === null)
    return res.status(400).send({
      success: false,
      message: 'user not found',
    })
  res.status(204).json({
    success: true,
    message: 'root is deleted successfully',
    data: deletedRoot,
  })
}

//@desc         delete admin
//@route        PATCH /api/v1/users/admins/:id
//@access       private(admin, root)
export const deleteAdmin = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const deletedAdmin = await User.deleteOne(
    { _id: req.params.id, role: Roles.ADMIN, company: req.user!.company },
    { new: true },
  )
  // We need to check if this admin is in the same company
  if (deletedAdmin === null)
    return res.status(400).send({
      success: false,
      message: 'user not found',
    })

  res.status(204).json({
    success: true,
    message: 'admin is deleted successfully',
    data: deletedAdmin,
  })
}

//@desc         delete employee
//@route        PATCH /api/v1/users/employees/:id
//@access       private(admin, root)
export const deleteEmployee = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  // const deletedEmployee = await User.deleteOne({_id: req.params.id, role: Roles.EMPLOYEE, company: req.user!.company}, {new: true});

  const user :any= req.params.id
  await Payrol.deleteMany({ employee:user })
  await Contract.deleteOne({ employee:user })
  await Attendance.deleteMany({ member:user })
  await Blog.deleteMany({ user:user })
  await Blog.updateMany({ user:user },{
    $pull:{
      'likes.$.user':user,
      comments:{$eq:user}
    }
  })

  await Request.deleteMany({ to:user })
  await Request.deleteMany({ from:user })
  await Document.deleteMany({ userId:user })
  await Comment.deleteMany({ user:user })
  await Request.deleteMany({ from:user })
  await Task.deleteMany({ from:user })
  await Notification.deleteMany({ employee:user })
  await Task.updateMany(
    {to:{$in:user}},
    {
      $pull: {
        to:user,
      },
    },
  )
  await Break.updateMany(
    {users:{$in:req.user}},
    {
      $pull: {
        users:user,
      },
    },
  )
  await Overtime.updateMany(
    {users:{$in:req.user}},
    {
      $pull: {
        users:user,
      },
    },
  )
  const deletedEmployee = await User.deleteOne(
    { _id: req.params.id },
    { new: true },
  )
  if (deletedEmployee === null)
    return res.status(400).send({
      success: false,
      message: 'user not found',
    })
  res.status(204).json({
    success: true,
    message: 'employee is deleted successfully',
    data: deletedEmployee,
  })
}
