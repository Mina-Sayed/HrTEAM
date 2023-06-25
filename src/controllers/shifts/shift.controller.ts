import { Attendance } from './../../models/attendenc.model'
import { Roles, days } from './../../types/enums'
import { Shift, IShift } from '../../models/Shift'
import { NextFunction, Request, Response } from 'express'
import { AuthenticatedReq } from '../../middlewares/auth'
import { nameDays } from '../../types/enums'
import User from '../../models/User'
import { Overtime } from '../../models/OverTime'
import { Break } from '../../models/Break'
import Payrol from '../../models/payrol'
//@desc         create a shift
//@route        POST /api/v1/shift
//@access       private(root,admin)
export const addShift = async (req: AuthenticatedReq, res: Response) => {
  const { name, branch, time, start_day, end_day, allows } = req.body
  // time.start_hour = time.start_hour && time.start_hour -2
  // time.end_hour = time.end_hour && time.end_hour -2
  //II:must the shift be unique in the selected branch
  const uniqueShift = await Shift.findOne({ branch: branch, name: name })
  if (uniqueShift)
    return res
      .status(400)
      .send({ error_en: 'The shift with the given NAME used befor' })
  const shift = new Shift({
    name: name,
    branch: branch,
    time: {
      start_hour: time.start_hour,
      end_hour: time.end_hour,
    },
    allows: {
      lateTime: {
        hours: allows.lateTime.hours,
        mins: allows.lateTime.mins,
      },
      leavingTime: {
        hours: allows.leavingTime.hours,
        mins: allows.leavingTime.mins,
      },
    },
    start_day: start_day,
    end_day: end_day,
  })
  shift.save()
  res.send({
    success: true,
    data: shift,
    message_en: 'Shift is created successfully',
  })
}
//@desc         update a shift
//@route        put /api/v1/shift/:branch/:id
//@access       private(root,admin)
export const updateShift = async (req: AuthenticatedReq, res: Response) => {
  const { name, time, start_day, end_day, allows } = req.body
  const branchId = req.params.branch
  const shiftId = req.params.id
  const shift: any = await Shift.findOne({ branch: branchId, _id: shiftId })
  const weeklyHolidays: any = []
  const origianalDays: any = []
  const TheStartDay = start_day ? start_day : shift.start_day
  const TheEndDay = end_day ? end_day : shift.end_day
    
  for (let index = TheEndDay; index >= TheStartDay; index--) {
    
    origianalDays.push(index)
  }
  for (let index = 0; index < days.length; index++) {
    const day = days[index]
    if (!origianalDays.includes(day)) {
      weeklyHolidays.push(day)
    }
  }
  
  if (!shift) return res.status(400).send({ error_en: 'Invaild shift !!' })
  const originalTime = {
    hours:
      (time ? time.end_hour : shift.time.end_hour) -
      (time ? time.start_hour : shift.time.start_hour),
    mins:
      (time ? time.end_mins : shift.time.end_mins) -
      (time ? time.start_mins : shift.time.start_mins),
  }
  // (time ? time.end_mins : shift.time.end_hour) -
  // (time ? time.start_hour : shift.time.start_hour)
  const uniqueShift = await Shift.findOne({
    _id: { $ne: shiftId },
    branch: branchId,
    name: name,
  })
  if (uniqueShift)
    return res
      .status(400)
      .send({ error_en: 'The shift with the given NAME used befor' })
  await Shift.updateOne(
    { branch: branchId, _id: shiftId },
    {
      ...req.body,
      allows: { ...allows, weeklyHolidays: weeklyHolidays },
      origianalDays: origianalDays,
      time: {
        originalTime: time ? originalTime : shift.time.originalTime,
        start_hour:
          time && time.start_hour ? time.start_hour : shift.time.start_hour,
        end_hour: time && time.end_hour ? time.end_hour : shift.time.end_hour,
        start_mins:
          time && time.start_mins ? time.start_mins : shift.time.start_mins,
        end_mins: time && time.end_mins ? time.end_mins : shift.time.end_mins,
      },
    },
    {new:true}
  )
  const newS = await Shift.findOne({ branch: branchId, _id: shiftId })
  res.send({
    success: true,
    data: newS,
    message_en: 'Shift is updated successfully',
  })
}
//@desc         delete a shift
//@route        DELETE /api/v1/shift/:branch/:id
//@access       private(root,admin)
export const deleteShift = async (req: AuthenticatedReq, res: Response) => {
  const branchId = req.params.branch
  const shiftId = req.params.id
  const shift = await Shift.findOne({ branch: branchId, _id: shiftId })
  if (!shift) return res.status(400).send({ error_en: 'Invaild shift !!' })
  await User.updateMany(
    { shift: shiftId },
    {
      $set: {
        shift: null,
      },
    },
  )
  console.log('shiftId: ',shiftId)
  await Shift.deleteOne({ _id: shiftId })
  await Overtime.deleteMany({ shift: shiftId })
  await Break.deleteMany({ shift: shiftId })
  await Attendance.updateMany(
    { shift: shiftId },
    {
      $set: {
        shift: null,
      },
    },
  )
  await Payrol.updateMany(
    { shift: shiftId },
    {
      $set: {
        shift: null,
      },
    },
  )
  res.send({
    success: true,
    message_en: 'Shift  deleted successfully',
  })
}
//@desc         get all shifts in branch
//@route        GET /api/v1/shift/:branch
//@access       private(root,admin)
export const getAllShifts = async (req: AuthenticatedReq, res: Response) => {
  const branchId = req.params.branch
  const user: any = req.user
  console.log('reShift: ', req?.user?.shift)
  let shifts
  if (user.role === Roles.EMPLOYEE) {
    shifts = await Shift.find({
      branch: req.user?.branch,
      _id: req.user?.shift,
    })
  } else {
    shifts = await Shift.find({ branch: branchId })
  }
  res.send({
    success: true,
    data: shifts,
    message_en: 'shifts are fetched successfully',
  })
}
//@desc         get a shift
//@route        GET /api/v1/shift/:branch/:name
//@access       private(root,admin)
export const getShift = async (req: AuthenticatedReq, res: Response) => {
  const branchId = req.params.branch
  const shiftId = req.params.id
  let shift

  shift = await Shift.findOne({ branch: branchId, _id: shiftId })

  if (!shift) return res.status(400).send({ error_en: 'Invaild shift !!' })
  res.send({
    success: true,
    data: shift,
    message_en: 'Shift is fetched successfully',
  })
}
//@desc         add weeklyHolidays in shift
//@route        POST /api/v1/shift/holidays/:branch/:name
//@access       private(root,admin)
export const addHolidays = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const branchId = req.params.branch
  const shiftId = req.params.id
  const { weeklyHolidays } = req.body
  // if the shift invaild
  const shift = await Shift.findOne({ branch: branchId, _id: shiftId })
  if (!shift) return res.status(400).send({ error_en: 'Invaild shift !!' })
  // if the any day of day already exist
  for (let index = 0; index < weeklyHolidays.length; index++) {
    const day = weeklyHolidays[index]
    const holidy = await Shift.findOne({
      branch: branchId,
      _id: shiftId,
      weeklyHolidays: { $elemMatch: { $eq: day } },
    })
    if (holidy) {
      index = weeklyHolidays.length - 1
      return res
        .status(400)
        .send({ error_en: `The Day :${nameDays[day]} is Already Exist` })
    }
  }
  // update holidays
  const upateHolidys = {
    $push: {
      weeklyHolidays: weeklyHolidays.map((day: Array<Number>) => {
        return day
      }),
    },
    $pull: {
      origianalDays: weeklyHolidays.map((day: Array<Number>) => {
        return day
      }),
    },
  }
  await Shift.updateOne({ branch: branchId, _id: shiftId }, upateHolidys)
  const newHolid = await Shift.findOne({ branch: branchId, _id: shiftId })
  res.send({
    success: true,
    data: newHolid?.weeklyHolidays,
    message_en: 'Holidays are updated successfully',
  })
}
//@desc         add weeklyWorkDays in shift
//@route        POST /api/v1/shift/workdays/:branch/:name
//@access       private(root,admin)
export const addWorkDays = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const branchId = req.params.branch
  const shiftId = req.params.id
  const { origianalDays } = req.body
  // if the shift invaild
  const shift = await Shift.findOne({ branch: branchId, _id: shiftId })
  if (!shift) return res.status(400).send({ error_en: 'Invaild shift !!' })
  // if the any day of days already exist
  for (let index = 0; index < origianalDays.length; index++) {
    const day = origianalDays[index]
    const holidy = await Shift.findOne({
      branch: branchId,
      _id: shiftId,
      origianalDays: { $elemMatch: { $eq: day } },
    })
    if (holidy) {
      index = origianalDays.length - 1
      return res
        .status(400)
        .send({ error_en: `The Day :${nameDays[day]} is Already Exist` })
    }
  }
  // update workdays
  const upateWorkDays = {
    $pull: {
      weeklyHolidays: origianalDays.map((day: Array<Number>) => {
        return day
      }),
    },
    $push: {
      origianalDays: origianalDays.map((day: Array<Number>) => {
        return day
      }),
    },
  }
  await Shift.updateOne({ branch: branchId, _id: shiftId }, upateWorkDays)
  const newWorkDay = await Shift.findOne({ branch: branchId, _id: shiftId })
  return res.send({
    success: true,
    data: newWorkDay?.origianalDays,
    message_en: 'Holidays are updated successfully',
  })
}
