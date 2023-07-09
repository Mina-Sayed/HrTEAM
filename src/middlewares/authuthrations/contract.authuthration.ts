import { Department } from './../../models/Department'
import { Branch } from './../../models/Branch'

import { NextFunction, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../auth'
import { Company } from '../../models/Company'
import Contract from '../../models/Contract'

export const AuthuthrationContract = (type: string, mode?: string) =>
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
    const branch: any = await Branch.findOne({
      _id: req.body.branch
        ? req.body.branch
        : req.params.branch
          ? req.params.branch
          : req.query.branch,
    })
    const departmentsId =
      branch &&
      (await Department.find({ branch: branch._id })).map((department) =>
        department._id.toString(),
      )
    //Data of body
    let { department } = req.body
    if (type === 'contract') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in this( branch , comapny , department) because you are not the owner of the company has this (branch , department )`,
      }

      const employee: any = await User.findOne({
        _id: req.body.employee,
        role: ['employee',"admin"],
      }).populate('branch')

      if (mode === 'post' || mode === 'put') {
        if (!employee)
          return res.status(400).send({ error_en: 'Invalid Emploeey' })
        if (
          !companiesId.includes(employee.branch.company.toString()) ||
          !companiesId.includes(branch.company.toString()) ||
          !departmentsId.includes(department)
        )
          return res.status(401).send(error)

        if (
          employee.branch._id.toString() !== branch._id.toString() ||
          employee.department.toString() !== department
        )
          return res.status(400).send({
            error_en:
              'the employee is not found with the given branch or is not found with the given department',
            error_ar:
              'لم يتم العثور على الموظف في الفرع المحدد أو لم يتم العثور عليه في القسم المحدد',
          })
      } else if (mode === 'get') {
        const { department } = req.query
        if (
          (req.params.company && !companiesId.includes(req.params.company)) ||
          (branch && !companiesId?.includes(branch?.company?.toString())) ||
          (department && !departmentsId?.includes(department))
        )
          return res.status(401).send(error)
      } else if (mode === 'delete') {
        console.log('befor Zanykaa; ')

        const contract: any = await Contract.findById(req.params.id).populate(
          'branch',
        )
        if (!contract)
          return res.status(400).send({ error_en: 'Invalid Contract' })
        if (!companiesId.includes(contract.branch.company.toString()))
          return res.status(401).send(error)
      }
    }
    next()
  }
