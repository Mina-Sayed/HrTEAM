import { NextFunction, Response } from 'express'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Company } from '../../models/Company'
import Subscription from '../../models/Subscription'
import User from '../../models/User'
import { FindeById } from '../../validators/find'
import { Branch } from '../../models/Branch'
import { Department } from '../../models/Department'
import { Shift } from '../../models/Shift'
import { Attendance } from '../../models/attendenc.model'
import { Break } from '../../models/Break'
import Request from '../../models/Request'
import Payrol from '../../models/payrol'
import Contract from '../../models/Contract'
import { Notification } from '../../models/notification.model'
import Blog from '../../models/blog.model'
import Task from '../../models/task'
import SubTask from '../../models/subTask'
import Category from '../../models/Category'
//@desc         create a company
//@route        POST /api/v1/company
//@access       private(root) 
export const addCompany = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body
  const ownerId = req.user?._id
  // get subscripe
  const subscription: any = await Subscription.findOne({ subscriber: req.user?._id })
  console.log(subscription);

  //I:must check how companies the root can added
  console.log('subcription: form the owner: ', ownerId)
  const companies: any = await Company.find({ owner: ownerId })
  if (subscription?.companiesAllowed == companies.length)
    return res.status(400).send({
      error_en:
        "You can't add more of compines becuse You have exceeded the limit of your Companies Allowed",
      error_ar: 'لا يمكنك إضافة المزيد من المجموعات لأنك تجاوزت الحد المسموح به لشركاتك'
    })
  //IV:must the name company be unique
  const nameCo = await Company.findOne({ owner: ownerId, name: name })
  if (nameCo)
    return res
      .status(400)
      .send({ error_en: 'The company with the given NAME used befor' })
  const company = new Company({
    owner: ownerId,
    name: name,
  })
  res.send({
    success: true,
    data: company,
    message_en: 'company is created successfully',
  })
  company.save()
}
//@desc         get all companies owner
//@route        GET /api/v1/company
//@access       private(root,admin)
export const getOwnerCompanies = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const ownerId = req.user?._id
  const companies: any = await Company.find({ owner: ownerId })
  res.send({
    success: true,
    data: companies,
    message_en: 'Companies are fetched successfully',
  })
}
//@desc         get a company by name
//@route        GET /api/v1/company/:id
//@access       private(root,admin)
export const getCompanyByName = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const ownerId = req.user?._id
  const company: any = await Company.findOne({
    owner: ownerId,
    _id: req.params.id,
  })
  res.send({
    success: true,
    data: company,
    message_en: 'Company is fetched successfully',
  })
}
//@desc         update a company by name
//@route        PUT /api/v1/company/:id
//@access       private(root)
export const updateCompanyByName = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const { name } = req.body
  const ownerId = req.user?._id
  const chakeCompany = await Company.findOne({
    owner: ownerId,
  })
  console.log(name);

  if (!chakeCompany)
    return res
      .status(400)
      .send({ error_en: 'The company with the given NAME is not found' })
  //IV:must the name company be unique
  const nameCo = await Company.findOne({ name: name, _id: req.params.id })
  if (nameCo)
    return res
      .status(400)
      .send({ error_en: 'The company with the given NAME used befor' })
  await Company.updateOne(
    { owner: ownerId, _id: req.params.id },
    {
      $set: {
        name: name,
      },
    },
  )
  const newCompany = await Company.findOne({
    owner: ownerId,
    _id: req.params._id,
  })
  res.send({
    success: true,
    data: newCompany,
    message_en: 'Company is updated successfully',
  })
}
//@desc         delete a company by id
//@route        DELETE /api/v1/company/:id
//@access       private(root)

export const deleteCompanyById = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const chakeCompany = await Company.findOne({ _id: req.params.id })
  // if (chakeCompany?.clicked === 0) {
  //   await Company.updateOne({ clicked: 1 })
  //   return res.send({
  //     message_en:
  //       'If you want delete the company must know you will lose all your data in the company like the employees  , shifts , branches , departments',
  //     message_ar:
  //       'إذا كنت ترغب في حذف الشركة ، يجب أن تعلم أنك ستفقد جميع بياناتك في الشركة مثل الموظفين ، ورديات العمل ، والفروع ، والإدارات',
  //   })
  // }
  if (!chakeCompany)
    return res
      .status(400)
      .send({ error_en: 'The company with the given ID is not found' })
  const branches = (await Branch.find({ company: req.params.id })).map(
    (branch) => branch._id,
  )
  await User.deleteMany({ company: req.params.id })
  await Company.deleteOne({ _id: req.params.id })
  await Department.deleteMany({ branch: branches })
  await Shift.deleteMany({ branch: branches })
  await Attendance.deleteMany({ branch: branches })
  await Request.deleteMany({ branch: branches })
  await Payrol.deleteMany({ branch: branches })
  await Contract.deleteMany({ branch: branches })
  await Branch.deleteMany({ company: req.params.id })
  await Notification.deleteMany({ company: req.params.id })
  await Blog.deleteMany({ company: req.params.id })
  await Task.deleteMany({ company: req.params.id })
  await SubTask.deleteMany({ company: req.params.id })
  await Category.deleteMany({ company: req.params.id })
  res.send({
    success: true,
    message_en: 'Company is deleted successfully',
  })
}
