import { ErorrResponse } from './../../errors/errorResponse'
import { Roles } from './../../types/enums'
import { UserI } from '../../models/User'
import { Company, ICompany } from '../../models/Company'
import { NextFunction, Request, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../../middlewares/auth'
//@desc         get all superadmins
//@route        GET /api/v1/users/superadmins
//@access       private(super admins)
export const getAllSuperAdmins = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allSupervisors = await User.find({ role: 'super admin' })
  return res.send({
    success: true,
    data: allSupervisors,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all roots
//@route        GET /api/v1/users/roots
//@access       private(super admins)
export const getAllRoots = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allRoots = await User.find({ role: 'root' })
  return res.send({
    success: true,
    data: allRoots,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all admins
//@route        GET /api/v1/users/admin
//@access       private(admin, root, employee)
export const getAllAdmins = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  let owner
  if (req.user?.role === 'root') {
    owner = req.user._id
  } else {
    return res
      .status(401)
      .send({ erorr_en: 'You are not owner to access on this ' })
  }
  const companies = await Company.find({ owner: owner })
  for (let index = 0; index < companies.length; index++) {
    const element = companies[index]
    const towIndex = companies.length - (companies.length - index) + 1
    const users = await User.find({ comapny: element._id, role: 'admin' })
    if (!users[0])
      return res.status(404).send({ error_en: "You don't have admins yet .." })

    if (companies.length - 1 === index) {
      return res.send({
        success: true,
        data: users,
        message: 'Users are fetched successfully',
      })
    }
  }
  // const allEmployees = await User.find({ role: 'employee', company: req.user!.company });
}
//@desc         get all users
//@route        GET /api/v1/users/
//@access       private(admin, root, employee)
export const getAllUsers = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  
  const users = await User.find({role:Roles.USER})
 
   
      return res.send({
        success: true,
        data: users,
        message: 'Users are fetched successfully',
      })
    
  
  // const allEmployees = await User.find({ role: 'employee', company: req.user!.company });
}
//@desc         get all admins in company
//@route        GET /api/v1/users/admins/:company
//@access       private(admin, root)
export const getAllAdminsInCompany = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allAdmins = await User.find({
    role: 'admin',
    company: req.params.company,
  })
  if (!allAdmins[0])
    return res
      .status(404)
      .send({ error_en: "You don't have admins yet on the company.." })
  return res.send({
    success: true,
    data: allAdmins,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all admins in branch
//@route        GET /api/v1/users/admins/:branch
//@access       private(admin, root)
export const getAllAdminsInBranch = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allAdmins = await User.find({
    role: 'admin',
    company: req.params.branch,
  })
  if (!allAdmins[0])
    return res
      .status(404)
      .send({ error_en: "You don't have admins yet on the branch.." })
  return res.send({
    success: true,
    data: allAdmins,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all admins in department
//@route        GET /api/v1/users/admins/:department
//@access       private(admin, root)
export const getAllAdminsInDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allAdmins = await User.find({
    role: 'admin',
    company: req.params.department,
  })
  if (!allAdmins[0])
    return res
      .status(404)
      .send({ error_en: "You don't have admins yet on the department.." })
  return res.send({
    success: true,
    data: allAdmins,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all employees
//@route        GET /api/v1/users/employyes
//@access       private(admin, root, employee)
export const getAllEmployees = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  let owner
  if (req.user?.role === 'admin') {
    const comapny = await Company.findOne({ owner: req.user._id })
    owner = comapny?.owner
  } else if (req.user?.role === 'root') {
    owner = req.user._id
  }
  const companies = (await Company.find({ owner: owner })).map((company) =>
    company._id.toString(),
  )
  const users = await User.find({
    company: companies,
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
  })
  if (!users[0])
    return res.status(404).send({ error_en: "You don't have employees yet .." })
  return res.send({
    success: true,
    data: users,
    message: 'Users are fetched successfully',
  })

  // const allEmployees = await User.find({ role: 'employee', company: req.user!.company });
}
//@desc         get all employees on company
//@route        GET /api/v1/users/employye/company/:company
//@access       private(admin, root, employee)
export const getAllEmployeesInComapny = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  console.log('dsadsadsad')

  let allEmployees: Array<any>
  if (req.user?.role === Roles.EMPLOYEE) {
    allEmployees = await User.find({
      role: ['employee', 'admin'],
      branch: req.user.branch,
    }).populate('department branch shift company')
  } else {
    allEmployees = await User.find({
      role: ['employee', 'admin'],
      company: req.params.company,
    }).populate('department branch shift company')
    console.log(allEmployees)
  }
  if (!allEmployees[0])
    return res
      .status(404)
      .send({ error_en: "You don't have employees yet on the company.." })
  return res.send({
    success: true,
    data: allEmployees,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all employees on branch
//@route        GET /api/v1/users/employye/branch/:branch
//@access       private(admin, root, employee)
export const getAllEmployeesInBranch = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allEmployees = await User.find({
    role: ['employee', 'admin'],
    branch: req.params.branch,
  })
  return res.send({
    success: true,
    data: allEmployees,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all employees on branch
//@route        GET /api/v1/users/employye/department/:department
//@access       private(admin, root, employee)
export const getAllEmployeesInDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allEmployees = await User.find({
    role: ['employee','admin'],
    department: req.params.department,
  })

  return res.send({
    success: true,
    data: allEmployees,
    message: 'Users are fetched successfully',
  })
}

//DESC get All The Employees
//Route GET /api/v1/users/employee/?branch=id&department=id
export const getAllEmployeesInTheCompanyWithBranchAndDepartment = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  let empsAtEmp
  if (req?.user?.role == 'employee') {
    console.log(
      'reqBranch: ',
      req.user?.branch,
      req?.user?.department,
      req?.user?._id,
    )
    empsAtEmp = await User.find({
      _id: req?.user?._id,
      branch: req?.user?.branch,
      department: req?.user?.department,
    })
  } else {
    let filterationOption = req.query
      ? { ...req.query, company: req.params.companyId }
      : { company: req.params.companyId }
    empsAtEmp = await User.find(filterationOption)
    if (!empsAtEmp[0]) {
      return res
        .status(400)
        .send({
          error_en: 'Employees Are Not Found',
          error_ar: 'لم يتم العثور على الموظفين',
        })
    }
  }

  res
    .status(200)
    .send({
      success_en: 'Employees Are Fetched Successfully',
      success_ar: 'تم جلب الموظفين بنجاح',
      users: empsAtEmp,
    })
}
//@desc         get all employees on branch
//@route        GET /api/v1/users/employye/department/:department
//@access       private(admin, root, employee)
export const getAllEmployeesInShift = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const allEmployees = await User.find({
    role: ['employee','admin'],
    shift: req.params.shift,
  })
  if (!allEmployees[0])
    return res
      .status(404)
      .send({ error_en: "You don't have employees yet on the shift.." })
  return res.send({
    success: true,
    data: allEmployees,
    message: 'Users are fetched successfully',
  })
}
//@desc         get all admins and owner
//@route        GET /api/v1/users/employye/infoComapny
//@access       private(admin, root, employee)
export const getRootAndAdmin = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const user: any = await User.find({ role: 'employee', _id: req.user?._id })
  if (!user) return res.status(404).send({ error_en: 'Invalid User' })
  const company: any = await Company.findOne({ _id: user.company })
    .populate('owner users')
    .sort('createdAt')
  const getAdmins = await User.find({ role: 'admin', comapny: company._id })
  return res.send({
    success: true,
    data: { admins: getAdmins, owner: company.owner },
    message: 'Users are fetched successfully',
  })
}
//@desc         get me
//@route        GET /api/v1/users/employye/me
//@access       private(admin, root, employee)
export const getMe = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const user: any = await User.find({ _id: req.user?._id })
  if (!user) return res.status(404).send({ error_en: 'Invalid User' })

  return res.send({
    success: true,
    data: user,
    message: 'Users are fetched successfully',
  })
}

// get all employees based on the role
export const getAllEmpsBasedOnRole = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  let emps: any[] = []
  if (req.user?.role == 'root') {
    // get all the companies
    const comps = await Company.find({ owner: req.user?._id })
    if (comps[0]) {
      emps = await User.find({ company: { $in: [...comps] } }).populate(
        'department branch shift company',
      )
    }
  } else {
    let roles =
      req.user?.role == 'admin'
        ? [Roles.ADMIN, Roles.EMPLOYEE]
        : [Roles.EMPLOYEE]
    let filter =
      req.user?.role === Roles.ADMIN
        ? {
            company: req.user?.company,
            role: { $in: [...roles] },
          }
        : { branch: req.user?.branch, role: { $in: [...roles] } }
    emps = await User.find(filter).populate('department branch shift company')
  }
  if (!emps[0]) {
    return res
      .status(400)
      .send({
        error_en: 'Employees Are Not Found',
        error_ar: 'لم يتم العثور على الموظفين',
      })
  }
  res
    .status(200)
    .send({
      success_en: 'Employees Are Fetched Successfully ',
      success_ar: 'يتم جلب الموظفين بنجاح',
      data: emps,
    })
}
