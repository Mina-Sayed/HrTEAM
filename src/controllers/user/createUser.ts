import { NextFunction, Request, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Roles } from '../../types/enums'
import { Company } from '../../models/Company'
import Subscription from '../../models/Subscription'

//@desc         create superadmin
//@route        POST /api/v1/users/superadmins
//@access       private(super admins)
export const createSuperAdmin = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const createdUser = await User.create({
    ...req.body,
    role: Roles.SUPER_ADMIN,
  })
  const token = createdUser.createToken()
  res.status(201).header('Authorization', token).json({
    success: true,
    message: 'super admin is created successfully',
    data: createdUser,
  })

}

//@desc         create root
//@route        POST /api/v1/users/roots
//@access       private(super admins)
export const createRoot =
 async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const createdUser = new User({
    ...req.body,
    role: Roles.ROOT,
  })
  const userSubscriptions = new Subscription({
    subscriber: createdUser._id,
    package: req.body.package,
  })
  if (!req.body.package)
    return res
      .status(400)
      .send({ error_en: 'The package requierd for create root' })
  // Here we need to check if a root was already created or not
  const token = createdUser.createToken()
  createdUser.save()
  userSubscriptions.save()
  res.status(201).header('Authorization', token).json({
    success: true,
    message: 'root  created successfully',
    data: { createdUser, userSubscriptions },
  })
}

//@desc         get all admins
//@route        GET /api/v1/users/admins
//@access       private(admin, root)
export const createAdmin = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const admin = await User.create({ ...req.body, role: Roles.ADMIN })
  return res.status(201).send({
    success: true,
    data: admin,
    message: 'admin is created successfully',
  })
}
//@desc         get all employees
//@route        GET /api/v1/users/employees
//@access       private(admin, root)
export const createEmployee = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  let employee
  if (req.user?.role === Roles.ROOT) {
    employee = new User({
      ...req.body,
    })
  } else {
    employee = new User({
      ...req.body,
      role: Roles.EMPLOYEE,
    })
  }

  if (!req.body.shift)
    return res.status(400).send({ error_en: 'pleas enter shift for employee' })
  //departments
  //branches
  //companies
  employee.save()
  return res.status(201).send({
    success: true,
    data: employee,
    message: 'employee is created successfully',
  })
}
//@desc         URL REGISTER EMPLOYEES
//@route        GET /api/v1/users/employees
//@access       private(admin, root)
// export const RegisterEmployee = async (req: Request, res: Response) => {
//     const Id = req.params.register

// }
//@desc         REGISTER
//@route        POST /api/v1/users/register
//@access       public
export const createUser = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const user = new User({
    ...req.body,
    role: Roles.USER,
  })
  user.save()
  return res.status(201).send({
    success: true,
    data: user,
    message: 'SignUp is successfully',
  })
}
