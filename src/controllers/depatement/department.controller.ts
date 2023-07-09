import { Roles } from './../../types/enums'
import { Branch } from '../../models/Branch'
import { NextFunction, Request, Response } from 'express'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Company } from '../../models/Company'
import { Department } from '../../models/Department'
import User from '../../models/User'
import Payrol from '../../models/payrol'
import Contract from '../../models/Contract'
//@desc         create a Department
//@route        POST /api/v1/department
//@access       private(root)
export const addDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const { name, branch } = req.body
  // IV:must the name department be unique
  const uniqueDepartment = await Department.findOne({
    branch: branch,
    name: name,
  })
  if (uniqueDepartment)
    return res
      .status(400)
      .send({ error_en: 'The department with the given NAME used befor' })
  const department = new Department({
    name: name,
    branch: branch,
  })
  department.save()
  res.send({
    success: true,
    data: department,
    message_en: 'Department created successfully',
  })
}
//@desc         update a Department
//@route        PUT /api/v1/department/:branch/:name
//@access       private(root)
export const updateDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body
  console.log(req.params.branch)
  console.log(req.params.id)

  //II:chake the department found with company
  const department = await Department.findOne({
    branch: req.params.branch,
    _id: req.params.id,
  })

  if (!department)
    return res.status(400).send({ error_en: 'Invaild departement!!' })
  //III:must the name depatment be unique
  const uniqueDepartment = await Department.findOne({
    _id: { $ne: req.params.id },
    branch: req.params.branch,
    name: name,
  })
  if (uniqueDepartment)
    return res
      .status(400)
      .send({ error_en: 'The department with the given name used befor ' })
  await Department.updateOne(
    { _id: req.params.id, branch: req.params.branch },
    {
      $set: {
        name: name,
      },
    },
  )
  const newD = await Department.findById(req.params.id)
  res.send({
    success: true,
    data: newD,
    message_en: 'Department updated successfully',
  })
}
//@desc         get all Departments
//@route        GET /api/v1/department/:branch
//@access       private(root)
//: a7a ya abdo
// : aya ya abdo tany Department.find({department})
//CHECK ROLE OF THE USER LOGED IN IF EMPLOYEE RETURN THE DEPARTMENT THAT HE WORKS AT ELESE ERETURN ALL
export const getAllDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  let departments
  if (Roles.EMPLOYEE === req.user?.role) {
    departments = await Department.find({ _id: req.user?.department })
    // console.log('departments: ', departments)
  }
  else
    departments = await Department.find({ branch: req.params.branch })
  res.send({
    success: true,
    data: departments,
    message_en: 'Departments are fetched successfully',
  })
}
//@desc         get a Department
//@route        GET /api/v1/department/:branch/:name
//@access       private(root)
export const getDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  //II:chake the departmnet found with company


  const department = await Department.findOne({
    branch: req.params.branch,
    _id: req.params.id,
  })
  if (!department)
    return res.status(400).send({ error_en: 'Invaild department!!' })
  res.send({
    success: true,
    data: department,
    message_en: 'Department is fetched successfully',
  })
}
//@desc         Delete a Department
//@route        DELETE /api/v1/department/:branch/:name
//@access       private(root)
// a7a ya abdo :: where the hell is the fucking delete for the department 
export const delteDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const department = await Department.findOne({
    branch: req.params.branch,
    _id: req.params.id,
  })
  if (!department)
    return res.status(400).send({ error_en: 'Invaild departement!!' })
  else {
    await Department.findByIdAndDelete(department?._id)
  }

  await User.updateMany(
    {
      department: req.params.id,
    },
    {
      $set: {
        department: null,
      },
    },
  )
  await Contract.updateMany(
    {
      department: req.params.id,
    },
    {
      $set: {
        department: null,
      },
    },
  )
  await Payrol.deleteMany(
    {
      department: req.params.id,
    },
  )

  res.send({
    success: true,
    message_en: 'Department  deleted successfully',
  })
}
