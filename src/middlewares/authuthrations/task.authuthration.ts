import { Branch } from './../../models/Branch'
import { NextFunction, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../auth'
import { Company } from '../../models/Company'
import Task from '../../models/task'
import { Department } from '../../models/Department'
export const AuthuthrationTask = (type: string, mode?: string) =>
  async function (req: AuthenticatedReq, res: Response, next: NextFunction) {
    //Obtaining user to know who is owner
    const user: any = await User.findOne({ _id: req.user?._id })
    let owner
    // If the user is a root, he gets his companies
    if (user.role === 'root') {
      owner = user._id
    }
    // If the user is an admin, he gets his owner and gets his companies
    else if (user.role === 'admin') {
      const company: any = await Company.findOne({ _id: user.company })
      owner = company.owner
    }
    // If the user is an employee, he gets his owner and gets his companies
    else if (user.role === 'employee') {
      const company: any = await Company.findOne({ _id: user.company })
      owner = company.owner
    }
    //Obtaining companies owner
    const companiesId: any = (
      await Company.find({ owner: owner })
    ).map((company) => company._id.toString())
    //Obtaining a branch to compare the company's branch between the companies that own to owner
    const branchReq: any = await Branch.findOne({
      _id: req.body.branch
        ? req.body.branch
        : req.params.branch
        ? req.params.branch
        : req.query.branch,
    })

    //Data of body
    if (type === 'task') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
        error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
      }
      const { to } = req.body
      if (mode === 'post') {
        const company = await Company.findOne({ _id: to })
        const branch = await Branch.findOne({ _id: to })
        const department: any = await Department.findOne({ _id: to }).populate(
          'branch',
        )
        const user = (await User.find({ _id: to })).map((user) =>
          user.company.toString(),
        )
        // // for company
        if (company && !companiesId.includes(company._id.toString()))
          return res.status(401).send(error)
        // // for branch
        if (branch && !companiesId.includes(branch.company.toString()))
          return res.status(401).send(error)
        // // for department
        if (
          department &&
          !companiesId.includes(department.branch.company.toString())
        )
          return res.status(401).send(error)
        // for employee
        if (user[0] && user.some((user) => !companiesId.includes(user)))
          return res.status(401).send(error)
        if (
          (req.body.company && !companiesId.includes(req.body.company)) ||
          (branchReq && !companiesId.includes(branchReq.company.toString()))
        )
          return res.status(401).send(error)
      } else if (mode === 'all') {
        if (user[0] && !companiesId.includes(req.user?.company.toString()))
          return res.status(401).send(error)
      } else if (mode === 'get' || mode === 'put' || mode === 'delete') {
        const task: any =
          req.params.id &&
          (await Task.findOne({ _id: req.params.id }))
        if (task && !companiesId.includes(task.company.toString()))
          return res.status(401).send(error)
      }
    }
    next()
  }
