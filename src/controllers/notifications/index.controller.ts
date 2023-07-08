import { Notification } from './../../models/notification.model'
import { NextFunction, Request, Response } from 'express'
import { AuthenticatedReq } from '../../middlewares/auth'
import { truncate } from 'fs'
export const getNotifictionEmployee = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const user: any = req.user
  const getAllUnRead = await Notification.find({
    employee: user._id,
    isSeen: false,
  }).populate([
    { path: 'employee', model: 'User' }
  ])
  const getAllSeen = await Notification.find({
    employee: user._id,
    isSeen: true,
  }).populate([
    { path: 'employee', model: 'User' }
  ])
  if (!getAllUnRead[0] && !getAllSeen[0])
    return res
      .status(400)
      .send({
        error_en: "you don't have any notifictions yet",
        error_ar: 'لا تمتللك اشعارت حتي الان',
      })
  return res.send({
    seen: getAllSeen,
    unSeen: getAllUnRead,
    count: getAllUnRead.length,
    success: true,
  })
}
export const getNotifictionAdminRoot = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const user: any = req.user
  const getAllUnRead = await Notification.find({
    to: user._id,
    isSeen: false,
  }).populate([
    { path: 'employee', model: 'User' }
  ])
  const getAllSeen = await Notification.find({
    to: user._id,
    isSeen: !false,
  }).populate([
    { path: 'employee', model: 'User' }
  ])
  if (!getAllUnRead[0] && !getAllSeen[0])
    return res
      .status(400)
      .send({ error_en: "you don't have any notifictions yet", error_ar: "لا تمتللك اشعارت حتي الان" })
  return res.send({
    seen: getAllSeen,
    unSeen: getAllUnRead,
    count: getAllUnRead.length,
    success: true,
  })
}
export const updateStatus = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const user: any = req.user
  const notification = await Notification.findOne({ _id: req.params.id })
  if (!notification)
    return res.status(400).send({ erorr_en: 'Invalid Notification' })
  await Notification.updateOne(
    { _id: req.params.id },
    {
      $set: {
        isSeen: true,
      },
    },
  )
  const getAllUnRead = await Notification.find({
    to: user._id,
    isSeen: false,
  })
  const getAllSeen = await Notification.find({
    to: user._id,
    isSeen: !false,
  })
  res.send({
    seen: getAllSeen,
    unSeen: getAllUnRead,
    count: getAllUnRead.length,
    success: true,

  })
}
