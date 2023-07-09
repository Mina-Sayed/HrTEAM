import { Shift } from './../../models/Shift'
import { Department } from './../../models/Department'
import { Branch } from './../../models/Branch'

import { NextFunction, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../auth'
import { Company } from '../../models/Company'
import Contract from '../../models/Contract'

export const AuthuthrationAdminEmployee = (type: string, mode?: string) =>
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
    let { department, company, shift } = req.body
    if (type === 'employee' || type === 'admin') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in this( branch , comapny , department) because you are not the owner of the company has this (branch , department )`,
      }
      const shift: any = await Shift.findById(req.body.shift).populate('branch')
      if (mode === 'post') {
        if (!shift)
          return res
            .status(400)
            .send({ error_en: 'Please check you have add shift for employee' })
        if (
          !companiesId.includes(company) ||
          !companiesId.includes(branch.company.toString()) ||
          !companiesId.includes(shift.branch.company.toString()) ||
          !departmentsId.includes(department)
        )
          return res.status(401).send(error)
      } else if (mode === 'delete' || mode === 'put') {
        const user: any = await User.findOne({ _id: req.params.id })
        const { company, department } = req.body
        if (
          !companiesId.includes(user.company.toString()) ||
          (company && !companiesId.includes(company)) ||
          (branch && !companiesId.includes(branch.company.toString())) ||
          (shift && !companiesId.includes(shift.branch.company.toString())) ||
          (department && !departmentsId.includes(department))
        )
          return res.status(401).send(error)
      } else if (mode === 'get') {
        const { company, department, shift } = req.params
        const shiftV: any =
          shift && (await Shift.findById(shift).populate('branch'))
        const departmentV: any =
          department &&
          (await Department.findOne({
            _id: department,
          }).populate('branch'))
        if (department && !departmentV)
          return res.status(400).send({ error_en: 'Invalid Department !!' })
        if (shift && !shiftV)
          return res.status(400).send({ error_en: 'Invalid Shift !!' })

        if (company && !companiesId.includes(company))
          return res.status(401).send(error)
        else if (branch && !companiesId.includes(branch.company.toString()))
          return res.status(401).send(error)
        else if (
          department &&
          departmentV &&
          !companiesId.includes(departmentV.branch.company.toString())
        )
          return res.status(401).send(error)
        else if (
          shift &&
          shiftV &&
          !companiesId.includes(shiftV.branch.company.toString())
        )
          return res.status(401).send(error)
      }
    }
    next()
  }
