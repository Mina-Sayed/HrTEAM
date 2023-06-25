import { Break } from './../../models/Break';
import { Overtime } from './../../models/OverTime'
import { Branch } from './../../models/Branch'
import { Shift } from './../../models/Shift'

import { NextFunction, Response } from 'express'
import User from '../../models/User'
import { AuthenticatedReq } from '../auth'
import { Company } from '../../models/Company'

export const AuthuthrationBreakOver = (type: string, mode?: string) =>
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
    if (type === 'break' || type === 'overtime') {
      const error = {
        error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
        error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
      }
      const { shift, id } = req.params
      console.log(shift);
      
      const overtiome: any = id && (await Overtime.findOne({ _id: id }))
      const breaks: any = id && (await Break.findOne({ _id: id }))     
      console.log(req.body.shift);
       
      if (!breaks && !overtiome && id)
        return res.status(400).send({ error_en: 'Invaild OverTime Or Break!!' })
      const shiftValid: any = overtiome ?  await Shift.findOne({
        _id: shift ? shift : req.body.shift ? req.body.shift : overtiome.shift,
      }).populate('branch') : await Shift.findOne({
        _id: shift ? shift : req.body.shift ? req.body.shift : breaks.shift,
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
    next()
  }
