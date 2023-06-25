import { ObjectId } from 'mongodb'
import { NextFunction, Request } from 'express'
import { Response } from 'express'
import { getRateData } from '../helpers/getRateData.helper'
import Contract from '../models/Contract'

//@desc         get total rate since contract
//@route        GET /api/v1/rate/:userId
//@access       private(admin)
export const rateSincecontract = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId =  new ObjectId(req.params.userId)

  const contract: any = await Contract.findOne({ member: userId })

  const rateData = await getRateData(
    contract.startDate,
    new Date(Date.now()),
    userId,
  )
  res.send(rateData)
}
//@desc         get month rate
//@route        GET /api/v1/rate/month/:userId
//@access       private(admin)
export const getRateMonth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { month, year }: any = req.query
  if (isNaN(month) || isNaN(year))
    return res.status(400).send('month and year are required')
  if (month < 1 || month > 12) return res.status(400).send('invalid month')
  if (year < 1) return res.status(400).send('invalid year')
  const userId = new ObjectId(req.params.userId)
  const fromDate = new Date(year, month - 1, 2)
  const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1)
  const rateData = await getRateData(fromDate, toDate, userId)
  res.send(rateData)
}
//@desc         get quarter rate
//@route        GET /api/v1/rate/quarter/:userId
//@access       private(admin)
export const qurterRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { quarter, year }: any = req.query
  const userId = req.params.userId
  if (isNaN(quarter) || isNaN(year))
    return res.status(400).send('quarter and year are required')
  if (quarter < 1 || quarter > 4)
    return res.status(400).send('quarter is (1~4)')
  if (year < 1) return res.status(400).send('invalid year')
  quarter = Math.floor(quarter)
  let startDate = new Date(year, (quarter - 1) * 3)
  let endDate = new Date(year, quarter * 3)
  const rateData = await getRateData(startDate, endDate, userId)
  res.send(rateData)
}
