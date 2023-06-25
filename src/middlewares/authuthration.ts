import { Shift } from '../models/Shift'
import { ICategory } from '../models/Category'
import { AuthenticatedReq } from './auth'
import e, { NextFunction, Response } from 'express'
import { Company } from '../models/Company'
import { Branch } from '../models/Branch'
import User from '../models/User'
import { Department } from '../models/Department'
import Category from '../models/Category'
import SubCategory from '../models/SubCategory'
import Contract, { IContract } from '../models/Contract'
import Request from '../models/Request'
import Task from '../models/task'
export const AuthuthrationMiddleware = (type: string, mode?: string) =>
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
      const company: any = await Company.find({ owner: user._id })
      owner = company.owner
    }
    // If the user is an employee, he gets his owner and gets his companies
    else if (user.role === 'employee') {
      const company: any = await Company.find({ owner: user._id })
      owner = company.owner
    }
    //Obtaining companies owner
    const companies: any = await Company.find({ owner: owner })
    //Obtaining a branch to compare the company's branch between the companies that own to owner
    let branch: any
    branch = await Branch.findOne({
      _id: req.body.branch ? req.body.branch : req.params.branch,
    })
    //Obtaining IDS companies
    const companiesId = companies.map((co: any) => {
      return co._id.toString()
    })
    //Obtaining department branch
    const departments = branch
      ? await Department.find({ branch: branch._id })
      : []

    //Obtaining IDS of departments
    const departmentsId = departments.map((dep: any) => {
      return dep._id.toString()
    })
    //Data of body
    let { company, department } = req.body
    if (type === 'company') {
      if (!companies[0] && !req.params.name)
        return res
          .status(404)
          .send({ error_en: "You don't have any company for now.." })
    }
    if (type === 'branch') {
      const companyValid = await Company.findOne({
        owner: owner,
        _id: company ? company : req.params.company,
      })
      if (!companyValid)
        return res.status(401).send({
          error_en:
            'You cannot (add or update or get) any branch in this company because you are not the owner of the company',
        })
    }
    if (type === 'departement' || type === 'shift') {
      console.log(branch)
      console.log(companiesId)

      if (req.params.company && !companiesId.includes(req.params.company))
        return res.status(401).send({
          error_en: `You cannot (add or update or get) any ${type} in this branch because you are not the owner of the company has this branch`,
        })
      if (branch && !companiesId.includes(branch.company.toString()))
        return res.status(401).send({
          error_en: `You cannot (add or update or get) any ${type} in this branch because you are not the owner of the company has this branch`,
        })
    }
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
          !companiesId.includes(company) ||
          !companiesId.includes(branch.company.toString()) ||
          !companiesId.includes(shift.branch.company.toString()) ||
          !departmentsId.includes(department)
        )
          return res.status(401).send(error)
      } else if (mode === 'get') {
        const { company, department } = req.params
        if (company && !companiesId.includes(company))
          return res.status(401).send(error)
        else if (branch && !companiesId.includes(branch.company.toString()))
          return res.status(401).send(error)
      }
    }
    if (type === 'contract') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in this( branch , comapny , department) because you are not the owner of the company has this (branch , department )`,
      }
      const employee: any = await User.findOne({
        _id: req.body.employee,
        role: 'employee',
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
        const { department } = req.params
        if (
          !companiesId.includes(req.params.company) ||
          (branch && !companiesId.includes(branch.company.toString())) ||
          (department && !departmentsId.includes(department))
        )
          return res.status(401).send(error)
      } else if (mode === 'delete') {
        const contract: any = await Contract.findById(req.params.id).populate(
          'brnach',
        )
        if (!contract)
          return res.status(400).send({ error_en: 'Invalid Contract' })
        if (!companiesId.includes(contract.branch.company.toString()))
          return res.status(401).send(error)
      }
    }
    if (type === 'break' || type === 'overtime') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
        error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
      }
      const { shift } = req.params
      const shiftValid: any = await Shift.findOne({
        _id: shift ? shift : req.body.shift,
      }).populate('branch')
      if (!shiftValid)
        return res.status(400).send({ error_en: 'Invalid Shift' })
      if (!companiesId.includes(shiftValid.branch.company.toString()))
        return res.status(401).send(error)
      if (req.body.userId) {
        const employee: any = await User.findOne({
          _id: req.body.userId,
          role: 'employee',
        }).populate('branch')
        if (!employee)
          return res.status(400).send({ error_en: 'Invalid Emploeey' })
        if (!companiesId.includes(employee.branch.company.toString()))
          return res.status(401).send(error)
        if (
          !employee.shift ||
          shiftValid._id.toString() !== employee.shift.toString()
        )
          return res.status(401).send({
            error_en: `User you are trying to assing to is not found in the shift : ${shiftValid.name} `,
          })
      }
    }
    if (
      type === 'category' &&
      (user.role === 'admin' ||
        user.role === 'root' ||
        user.role === 'employee')
    ) {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
      }
      if (mode === 'post') {
        if (!companiesId.includes(company)) return res.status(401).send(error)
      } else if (mode === 'get' || 'put' || 'delete') {
        const { company } = req.query
        if (
          !companiesId.includes(req.user?.company) &&
          !company &&
          !req.params.id
        )
          return res.status(401).send(error)
        else if (company && !companiesId.includes(company) && !req.params.id)
          return res.status(401).send(error)
        else if (req.params.id && !company) {
          const category: any = await Category.findOne({ _id: req.params.id })
          const companyId = category.company
            ? category.company.toString()
            : null
          if (!category || !companiesId.includes(companyId))
            return res.status(401).send(error)
        }
      }
    } else if (
      type === 'subCategory' &&
      (user.role === 'admin' ||
        user.role === 'root' ||
        user.role === 'employee')
    ) {
      if (req.params.id || req.body.category || req.params.categoryId) {
        const error = {
          error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
        }
        const subCategories: any = await SubCategory.findOne({
          _id: req.params.id,
        })

        let category: any = await Category.findOne({
          _id: subCategories ? subCategories.category : req.body.category,
        })
        category == null
          ? (category = await Category.findOne({ _id: req.params.categoryId }))
          : category
        const companyId = category.company ? category.company.toString() : null
        if (companyId && !companiesId.includes(companyId))
          return res.status(401).send(error)
      }
    }
    if (type === 'request') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
        error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
      }
      const { to, ids } = req.body
      if (mode === 'post') {
        const company = await Company.findOne({ _id: to })
        const branch = await Branch.findOne({ _id: to })
        const department: any = await Department.findOne({ _id: to }).populate(
          'branch',
        )
        const user = await User.find({ _id: ids })
        // for company
        if (company && !companiesId.includes(company._id.toString()))
          return res.status(401).send(error)
        // for branch
        if (branch && !companiesId.includes(branch.company.toString()))
          return res.status(401).send(error)
        // for department
        if (
          department &&
          !companiesId.includes(department.branch.company.toString())
        )
          return res.status(401).send(error)
        // for employee
        console.log(user)
        console.log(companiesId)

        if (
          user[0] &&
          user.some((user) => !companiesId.includes(user.company.toString()))
        )
          return res.status(401).send(error)
      }
      if (mode === 'get' || mode === 'put') {
        const requste: any =
          req.params.id &&
          (await Request.findOne({ _id: req.params.id }).populate('from'))
        if (requste && !companiesId.includes(requste.from.company.toString()))
          return res.status(401).send(error)
      }
    }
    if (type === 'task') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
        error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
      }
      const { to } = req.body
      if (mode === 'post') {
        // const company = await Company.findOne({ _id: to })
        // const branch = await Branch.findOne({ _id: to })
        // const department: any = await Department.findOne({ _id: to }).populate(
        //   'branch',
        // )
        const user = (await User.find({ _id: to })).map((user) =>
          user.company.toString(),
        )
        // // for company
        // if (company && !companiesId.includes(company._id.toString()))
        //   return res.status(401).send(error)
        // // for branch
        // if (branch && !companiesId.includes(branch.company.toString()))
        //   return res.status(401).send(error)
        // // for department
        // if (
        //   department &&
        //   !companiesId.includes(department.branch.company.toString())
        // )
        //   return res.status(401).send(error)
        // for employee
        if (user[0] && user.some((user) => !companiesId.includes(user)))
          return res.status(401).send(error)
      } else if (mode === 'all') {
        if (user[0] && !companiesId.includes(req.user?.company.toString()))
          return res.status(401).send(error)
      } else if (mode === 'get' || mode === 'put' || mode === 'delete') {
        const task: any =
          req.params.id &&
          (await Task.findOne({ _id: req.params.id }).populate('from'))

        if (task && !companiesId.includes(task.from.company.toString()))
          return res.status(401).send(error)
      }
    }
    next()
  }
