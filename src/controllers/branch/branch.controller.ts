import { NextFunction, Response } from 'express'
import { Branch } from '../../models/Branch'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Department } from '../../models/Department'
import { Shift } from '../../models/Shift'
import { Attendance } from '../../models/attendenc.model'
import Payrol from '../../models/payrol'
import Contract from '../../models/Contract'
import Request from '../../models/Request'
import User from '../../models/User'
import Task from '../../models/task'
import { Roles } from '../../types/enums'
//@desc         create a branch
//@route        POST /api/v1/branch
//@access       private(root)
export const addBranch = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const { name, lat, long, company, weeklyHolidays, fixedHolidays } = req.body
  //I:must check the company, his want add branch in it , he has this the company
  // const companyValid = await Company.find({ owner: ownerId, _id: company })
  // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot add a branch in this company because you are not the owner of the company" })
  //IV:must the name branch be unique
  const uniqueBranch = await Branch.findOne({
    name: name,
    company: company,
    location:{
      lat,
      long
    }
  })
  console.log(uniqueBranch);

  if (uniqueBranch)
    return res
      .status(400)
      .send({ error_en: 'The branch with the given NAME used befor' })
  const branch = new Branch({
    name: name,
    company: company ? company : req.params.company,
    location: {
      lat: lat,
      long: long,
    },
  })
  await branch.save()
  res.send({
    success: true,
    data: branch,
    message_en: 'Branch is created successfully',
  })
}
//@desc         get all branches in company
//@route        GET /api/v1/branch
//@access       private(root)
export const getAllBranches = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  //I:must check the company, his want fetched branches in it , he has this the company
  // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
  // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
  let branches: Array<any>
  if (req.user?.role === Roles.EMPLOYEE) {
    branches = await Branch.find({
      _id: req.user.branch,
    })
  } else {
    branches = await Branch.find({ company: req.params.company })
  }
  for (let index = 0; index < branches.length; index++) {
    // to get employees in this branch
    // !branches[index].emp[0]
    //   ? branches[index].emp.push(
    //       ...(await User.find({
    //         branch: branches[index]._id,
    //         role: 'employee',
    //       })),
    //     )
    //   : branches[index].emp
    //to get departments in this branch
    !branches[index].deps[0]
      ? branches[index].deps.push(
        ...(await Department.find({ branch: branches[index]._id })),
      )
      : branches[index].deps
    if (index === branches.length - 1) {
      res.send({
        success: true,
        data: branches,
        message_en: 'Branches are fetched successfully',
      })
    }
  }
  // console.log(branches);

  // console.log(branches);
}
//@desc         get all branches in company
//@route        GET /api/v1/branch
//@access       private(root)
export const getAllBranchesWithData = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  //I:must check the company, his want fetched branches in it , he has this the company
  // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
  // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
  let branches: Array<any>
  if (req.user?.role === Roles.EMPLOYEE) {
    branches = await Branch.find({
      _id: req.user.branch,
    })
  } else {
    branches = await Branch.find({ company: req.params.company })
  }
  // to get employees in this branch
  // !branches[index].emp[0]
  //   ? branches[index].emp.push(
  //       ...(await User.find({
  //         branch: branches[index]._id,
  //         role: 'employee',
  //       })),
  //     )
  //   : branches[index].emp
  //to get departments in this branch

  res.send({
    success: true,
    data: branches,
    message_en: 'Branches are fetched successfully',
  })

  // console.log(branches);

  // console.log(branches);
}
//@desc         get details branch in company
//@route        GET /api/v1/branch/:comapny/:name
//@access       private(root)
export const getBranch = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  //I:must check the company, his want get branch in it , he has this the company
  // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
  // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
  //II:chake the branch found with company
  const branch = await Branch.findOne({
    company: req.params.company,
    _id: req.params.id,
  })
  console.log('whre is the funcking dpes', branch)
  if (!branch) return res.status(400).send({ error_en: 'Invalid branch!!' })
  res.send({
    success: true,
    data: branch,
    message_en: 'Branch is fetched successfully',
  })
}
//@desc         update a branch
//@route        PUT /api/v1/branch/:company/:id
//@access       private(root)
export const updateBranch = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const { name, lat, long, fixedHolidays } = req.body
  const branch: any = await Branch.findOne({
    company: req.params.company,
    _id: req.params.id,
  })
  if (!branch) return res.status(400).send({ error_en: 'Invalid branch!!' })
  //III:must the name branch be unique
  // a7a ya abdo branch unique with name not the id 
  const uniqueBranch = await Branch.findOne({
    comapny: req.params.company,
    name: req.body.name
  })
  if (uniqueBranch)
    return res
      .status(400)
      .send({ error_en: 'The branch with the given ID used befor' })
  await Branch.updateOne(
    { company: req.params.company, _id: req.params.id },
    {
      $set: {
        name: name.toLowerCase(),
        location: {
          lat: lat ? lat : branch.location.lat,
          long: long ? long : branch.location?.long,
        },
      },
      $push: {
        fixedHolidays:
          fixedHolidays &&
          fixedHolidays.map((days: Array<Date>) => {
            return days
          }),
      },
    },
  )
  const newB = await Branch.findOne({
    company: req.params.company,
    _id: req.params.id,
  })
  res.send({
    success: true,
    data: newB,
    message_en: 'Branch is updated successfully',
  })
}
//@desc         delete a branch
//@route        DELETE /api/v1/branch/:company/:id
//@access       private(root)
export const deleteBranch = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const branch: any = await Branch.findOne({
    company: req.params.company,
    _id: req.params.id,
  })
  if (!branch) return res.status(400).send({ error_en: 'Invalid branch!!', error_ar: 'فرع غير صالح !!' })

  // if (branch?.clicked === 0) {
  //   await Branch.updateOne({ clicked: 1 })
  //   return res.send({
  //     message_en:
  //       'If you want delete the branch must know you will lose all your data in the barach like the employees , shifts , departments , contracts , payrolls',
  //     message_ar:
  //       'إذا كنت ترغب في حذف الشركة ، يجب أن تعلم أنك ستفقد جميع بياناتك في الفرع مثل الموظفين ، ورديات العمل ، والإدارات',
  //   })
  // }
  await Department.deleteMany({ branch: req.params.id })
  await Shift.deleteMany({ branch: req.params.id })
  await Attendance.deleteMany({ branch: req.params.id })
  await Request.deleteMany({ branch: req.params.id })
  await Payrol.deleteMany({ branch: req.params.id })
  await Contract.deleteMany({ branch: req.params.id })
  await Branch.deleteMany({ _id: req.params.id })
  await User.deleteMany({ branch: req.params.id })
  await Task.deleteMany({ branch: req.params.id })
  res.send({
    success: true,
    message_en: 'Branch  deleted successfully',
  })
}
