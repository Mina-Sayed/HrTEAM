import cron from 'node-cron'
import Contract from '../models/Contract'
import { getDateWithMuAnHAndS, timeLate } from './time.helper'
import { Notification } from '../models/notification.model'
import User from '../models/User'

export const autoNotification = async () => {
  const contracts = await Contract.find().populate('branch employee')
  for (let index = 0; index < contracts.length; index++) {
    const contract: any = contracts[index]
    const time = getDateWithMuAnHAndS(contract.endDate, new Date(Date.now()))
    const TimeStay = getDateWithMuAnHAndS(
      contract.endStay,
      new Date(Date.now()),
    )

    if (time.days <= 15 && time.days > 13) {
      const getNoit = await Notification.findOne({
        to: contract.employee,
        type: 'contract',
        days: { $lte: 15, $gte: 13 },
      })
      const admins: any =
        !getNoit &&
        (
          await User.find({
            company: contract.branch.company.toString(),
            role: ['admin','root'],
          })
        ).map((admin) => {
          return {
            company: contract.branch.company,
            des_en: `You must renew contract the user ${contract.employee.fullName_en} in the branch ${contract.branch.name} and the time remaining to the expiration contract date is ${time.days} days `,
            des_ar:
              `يوماً<span>${time.days}</span> والوقت المتبقي لتاريخ انتهاء العقد هو` +
              ` <span>${contract.branch.name}  في فرع </span>` +
              `<span>${contract.employee.fullName_en}</span> يجب تجديد عقد المستخدم `,
            title_en: `Renew Contract Employee ${contract.employee.fullName_en}`,
            title_ar: `<span> ${contract.employee.fullName_en}</span>  تجديد عقد الموظف `,
            to: admin._id,
            days: Number(time.days),
            employee: contract.employee,
            type: 'contract',
          }
        })
      !getNoit &&
        admins.push({
          company: contract.branch.company,
          des_en: `Your contract will expiration after ${time.days} days `,
          des_ar: `يوماً<span>${time.days}</span>سينتهي عقدك بعد `,
          title_en: `Renew Contract `,
          title_ar: `تجديد عقد`,
          to: contract.employee,
          days: Number(time.days),
          employee: contract.employee,
          type: 'contract',
        })
      !getNoit && (await Notification.insertMany(admins))
    } else if (time.days <= 7 && time.days >= 4) {
      const getNoit = await Notification.findOne({
        to: contract.employee,
        days: { $lte: 7, $gte: 4 },
        type: 'contract',
      })
      const admins: any =
        !getNoit &&
        (
          await User.find({
            company: contract.branch.company.toString(),
            role: ['admin','root'],
          })
        ).map((admin) => {
          return {
            company: contract.branch.company,
            des_en: `You must renew contract the user ${contract.employee.fullName_en} in the branch ${contract.branch.name} and the time remaining to the expiration contract date is ${time.days} days `,
            des_ar:
              `يوماً<span>${time.days}</span> والوقت المتبقي لتاريخ انتهاء العقد هو` +
              ` <span>${contract.branch.name}  في فرع </span>` +
              `<span>${contract.employee.fullName_en}</span> يجب تجديد عقد المستخدم `,
            title_en: `Renew Contract Employee ${contract.employee.fullName_en}`,
            title_ar: `<span> ${contract.employee.fullName_en}</span>  تجديد عقد الموظف `,
            to: admin._id,
            days: Number(time.days),
            employee: contract.employee,
            type: 'contract',
          }
        })
      !getNoit &&
        admins.push({
          company: contract.branch.company,
          des_en: `Your contract will expiration after ${time.days} days `,
          des_ar: `يوماً<span>${time.days}</span>سينتهي عقدك بعد `,
          title_en: `Renew Contract `,
          title_ar: `تجديد عقد`,
          to: contract.employee,
          days: Number(time.days),
          employee: contract.employee,
          type: 'contract',
        })
      !getNoit && (await Notification.insertMany(admins))
    } else if (time.days <= 0) {
      const getNoit = await Notification.findOne({
        to: contract.employee,
        type: 'contract',
        days: { $lt: 4 },
      })
      const admins: any =
        !getNoit &&
        (
          await User.find({
            company: contract.branch.company.toString(),
            role: ['admin','root'],
          })
        ).map((admin) => {
          return {
            company: contract.branch.company,
            des_en: `You must renew contract the user ${contract.employee.fullName_en} in the branch ${contract.branch.name} and the time remaining to the expiration contract date is ${time.days} days `,
            des_ar:
              `يوماً<span>${time.days}</span> والوقت المتبقي لتاريخ انتهاء العقد هو` +
              ` <span>${contract.branch.name}  في فرع </span>` +
              `<span>${contract.employee.fullName_en}</span> يجب تجديد عقد المستخدم `,
            title_en: `Renew Contract Employee ${contract.employee.fullName_en}`,
            title_ar: `<span> ${contract.employee.fullName_en}</span>  تجديد عقد الموظف `,
            to: admin._id,
            days: Number(time.days),
            employee: contract.employee,
            type: 'contract',
          }
        })
      !getNoit &&
        admins.push({
          company: contract.branch.company,
          des_en: `Your contract will expiration after ${time.days} days `,
          des_ar: `يوماً<span>${time.days}</span>سينتهي عقدك بعد `,
          title_en: `Renew Contract `,
          title_ar: `تجديد عقد`,
          to: contract.employee,
          days: Number(time.days),
          employee: contract.employee,
          type: 'contract',
        })
      !getNoit && (await Notification.insertMany(admins))
    }
    if (TimeStay.days <= 15 && TimeStay.days > 13) {
      const getNoit = await Notification.findOne({
        to: contract.employee,
        days: { $lte: 15, $gte: 13 },
        type: 'stay',
      })
      const admins: any =
        !getNoit &&
        (
          await User.find({
            company: contract.branch.company.toString(),
            role: ['admin','root'],
          })
        ).map((admin) => {
          return {
            company: contract.branch.company,
            des_en: `You must renew stay the user ${contract.employee.fullName_en} in the branch ${contract.branch.name} and the time remaining to the expiration stay date is ${time.days} days `,
            des_ar:
              `يوماً<span>${TimeStay.days}</span> والوقت المتبقي لتاريخ انتهاء الاقامه هو` +
              ` <span>${contract.branch.name}  في فرع </span>` +
              `<span>${contract.employee.fullName_en}</span> يجب تجديد عقد المستخدم `,
            title_en: `Renew Stay Employee ${contract.employee.fullName_en}`,
            title_ar: `<span> ${contract.employee.fullName_en}</span>  تجديد اقامة الموظف `,
            to: admin._id,
            days: Number(TimeStay.days),
            employee: contract.employee,
            type: 'stay',
          }
        })
      !getNoit &&
        admins.push({
          company: contract.branch.company,
          des_en: `Your stay will expiration after ${TimeStay.days} days `,
          des_ar: `يوماً<span>${TimeStay.days}</span>سينتهي عقدك بعد `,
          title_en: `Renew Stay `,
          title_ar: `تجديد الاقامه`,
          to: contract.employee,
          days: Number(TimeStay.days),
          employee: contract.employee,
          type: 'stay',
        })
      !getNoit && (await Notification.insertMany(admins))
    } else if (TimeStay.days<= 7 && TimeStay.days>= 4) {
      const getNoit = await Notification.findOne({
        to: contract.employee,
        days: { $lte: 7, $gte: 4 },
        type: 'stay',
      })
      const admins: any =
        !getNoit &&
        (
          await User.find({
            company: contract.branch.company.toString(),
            role: ['admin','root'],
          })
        ).map((admin) => {
          return {
            company: contract.branch.company,
            des_en: `You must renew stay the user ${contract.employee.fullName_en} in the branch ${contract.branch.name} and the time remaining to the expiration stay date is ${time.days} days `,
            des_ar:
              `يوماً<span>${TimeStay.days}</span> والوقت المتبقي لتاريخ انتهاء الاقامه هو` +
              ` <span>${contract.branch.name}  في فرع </span>` +
              `<span>${contract.employee.fullName_en}</span> يجب تجديد عقد المستخدم `,
            title_en: `Renew Stay Employee ${contract.employee.fullName_en}`,
            title_ar: `<span> ${contract.employee.fullName_en}</span>  تجديد اقامة الموظف `,
            to: admin._id,
            days: Number(TimeStay.days),
            employee: contract.employee,
            type: 'stay',
          }
        })
      !getNoit &&
        admins.push({
          company: contract.branch.company,
          des_en: `Your stay will expiration after ${TimeStay.days} days `,
          des_ar: `يوماً<span>${TimeStay.days}</span>سينتهي عقدك بعد `,
          title_en: `Renew Stay `,
          title_ar: `تجديد الاقامه`,
          to: contract.employee,
          days: Number(TimeStay.days),
          employee: contract.employee,
          type: 'stay',
        })
      !getNoit && (await Notification.insertMany(admins))
    } else if (TimeStay.days <= 0) {
      const getNoit = await Notification.findOne({
        to: contract.employee,
        days: { $lt: 4 },
        type: 'stay',
      })
      const admins: any =
        !getNoit &&
        (
          await User.find({
            company: contract.branch.company.toString(),
            role: ['admin','root'],
          })
        ).map((admin) => {
          return {
            company: contract.branch.company,
            des_en: `You must renew stay the user ${contract.employee.fullName_en} in the branch ${contract.branch.name} and the time remaining to the expiration stay date is ${time.days} days `,
            des_ar:
              `يوماً<span>${TimeStay.days}</span> والوقت المتبقي لتاريخ انتهاء الاقامه هو` +
              ` <span>${contract.branch.name}  في فرع </span>` +
              `<span>${contract.employee.fullName_en}</span> يجب تجديد عقد المستخدم `,
            title_en: `Renew Stay Employee ${contract.employee.fullName_en}`,
            title_ar: `<span> ${contract.employee.fullName_en}</span>  تجديد اقامة الموظف `,
            to: admin._id,
            days: Number(TimeStay.days),
            employee: contract.employee,
            type: 'stay',
          }
        })
      !getNoit &&
        admins.push({
          company: contract.branch.company,
          des_en: `Your stay will expiration after ${TimeStay.days} days `,
          des_ar: `يوماً<span>${TimeStay.days}</span>سينتهي عقدك بعد `,
          title_en: `Renew Stay `,
          title_ar: `تجديد الاقامه`,
          to: contract.employee,
          days: Number(TimeStay.days),
          employee: contract.employee,
          type: 'stay',
        })
      !getNoit && (await Notification.insertMany(admins))
    }
  }
}
