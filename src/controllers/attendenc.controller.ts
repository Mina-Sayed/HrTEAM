import { UserI } from './../models/User'
import { Attendance } from './../models/attendenc.model'
import { Shift } from './../models/Shift'
import { Overtime } from './../models/OverTime'
import { Break } from './../models/Break'
import { Branch } from './../models/Branch'
import { Response } from 'express'
import { AuthenticatedReq } from './../middlewares/auth'
import User from '../models/User'
import { getDistance } from '../helpers/distance.helper'
import {
  addMinutes,
  getDateWithMuAnHAndS,
  originalTime,
  timeLate,
} from '../helpers/time.helper'
import Payrol from '../models/payrol'
import Contract from '../models/Contract'
import { Roles } from '../types/enums'
const startToday = new Date(new Date().setHours(2, 0))
const endToday = new Date(new Date().setHours(25, 59))
export const attend = async (req: AuthenticatedReq, res: Response) => {
  const MIN_ACCURACY = 0.1 // km

  // get user with the branch and shift [User]
  //........................................#
  const TimeNow = new Date(Date.now())

  const dateNow = new Date(
    new Date(TimeNow).setHours(TimeNow.getHours() + 1, TimeNow.getMinutes()),
  ) // date for now
  console.log(dateNow, 'TimeNow')

  const user: any = await User.findById(req.user?._id)
  if (!user || !user.branch)
    return res
      .status(404)
      .send({ error_en: 'The user with any branch was not found' })
  //get branch and chake the user in the shift work
  const branch: any = await Branch.findOne({
    _id: user.branch,
    shift: user.shift,
  })
  if (!branch)
    return res
      .status(404)
      .send({ error_en: 'The branch with the given user shift was not found' })
  // get Break
  const breaks: any = await Break.find({
    users: { $elemMatch: { $eq: user._id } },
  })
  //get overTime
  const overtimes: any = await Overtime.find({
    users: { $elemMatch: { $eq: user._id } },
    start: {
      $gte: new Date(startToday).toISOString(),
      $lt: new Date(endToday).toISOString(),
    },
  })
  console.log(new Date(endToday).getDay())

  //get shift with the brnach
  let shift: any = await Shift.findOne({
    branch: user.branch,
    _id: user.shift,
    origianalDays: { $in: dateNow.getDay() },
  })

  // if the time shift not mache time now and the user dose not have any overtime for the day
  if (!shift && !overtimes[0])
    return res.status(200).send({
      message_en:
        "you don't have any shift for now and also don't have any overtime , maybe the day is holiday",
    })
  // Check for attendence location
  const { lat, long, radius } = req.body
  const branchLat = branch.location.lat
  const branchLong = branch.location.long
  console.log(long,"long");
  console.log(lat,"lat");
  
  const distance = getDistance(lat, long, branchLat, branchLong)

  
  if (distance > MIN_ACCURACY)
    return res
      .status(400)
      .send(
        "your location doesn't match the branch location. Please, make sure you use your phone",
      )
  //get user with attandence to chake
  let userAttend: any
  //........................................*
  // get the data the attendance need to created
  //............................................................#
  //...............................................................#
  // must  user location match branch location to accept sign [Shift]
  // soon will be valid *
  //...............................................................*
  let dateStartShift: any
  let chakeDay: any
  let timeSignOuSgift: any
  let timeToStartShift: any
  let dateEndtShift: any

  // originTime for user shift
  let originTim: any

  // must have a shift to a assign those properties
  if (shift) {
    dateStartShift = new Date(
      new Date().setHours(
        shift.time.start_hour,
        shift.time.start_mins && shift.time.start_mins,
      ),
    ) // >>> the time signin must be == time now or smaller time now
    dateEndtShift = new Date(
      new Date().setHours(
        shift.time.end_hour - 1,
        shift.time.end_mins && shift.time.end_mins,
      ),
    )
    console.log(dateStartShift, 'dateStartShift')
    console.log(dateNow, 'dateNow')

    // >>> the time signin must be == time now or smaller time now
    userAttend = await Attendance.findOne({
      member: user._id,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    })
    console.log(userAttend, "userAttend");
    
    chakeDay = shift.origianalDays.includes(dateNow.getDay()) // chake days
    // const addMinutesDateNow = addMinutes(dateNow, 30) // >>> after add 30 munites to time now
    originTim = shift.time.originalTime
    // collect the time left for  sing out from shift
    timeSignOuSgift = getDateWithMuAnHAndS(dateEndtShift, dateNow)
    timeToStartShift = getDateWithMuAnHAndS(dateStartShift, dateNow)
  }

  // time late
  // for break && siginoute of all
  let TimeBreak: any
  let userBreak: any
  let userBreakEnd: any
  let TimeOverTime: any
  // to know the near time for (TimeBreak , TimeSignOuteBreak )
  if (chakeDay) {
    let getBreak: any = await Attendance.findOne({
      member: user._id,
      shift: shift._id,
      createdAt: {
        $gte: new Date(dateStartShift).toISOString(),
        $lt: new Date(dateEndtShift).toISOString(),
      },
    })
    console.log(breaks)

    if (!breaks[0]) {
      TimeBreak = {
        left: true,
      }
    }

    breaks.map((br: any) => {
      //................#
      // to get time left for break and return the near Signin
      console.log(br)

      const startDate = new Date(
        new Date().setHours(br.start.hours, br.start.mins),
      )
      const endDate = new Date(new Date().setHours(br.end.hours, br.end.mins))

      const timeLeftBreak = getDateWithMuAnHAndS(startDate, dateNow)

      // to get time left for SignOut
      const timeLeftSignO = getDateWithMuAnHAndS(endDate, dateNow)
      // just if time left to sgin and sign out and the break is not open
      if (
        timeLeftBreak.hours == 0 &&
        timeLeftBreak.minutes <= 59 &&
        (timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0) &&
        !br.isOpen
      ) {
        return (TimeBreak = {
          timeBreakStart: startDate,
          timeBreakEnd: endDate,
          timeLeft: timeLeftBreak.minutes,
          signOute:
            timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
              ? { hours: timeLeftSignO.hours, muin: timeLeftSignO.minutes }
              : 0,
          isComplated:
            timeLeftSignO.minutes == 0 && timeLeftSignO.hours == 0
              ? true
              : false,
          left: timeLeftSignO.left ? true : false,
        })
      }
      // if the break is open must the user get out in any time for break
      else if (br.isOpen && userAttend) {
        console.log('yabaaa')

        let endTime
        // to add the time for break
        const hourswithMins = br.duration.hours * 60 + br.duration.mins
        //know first hour for break open
        const firtsMins = Math.abs(
          new Date(Date.now()).getMinutes() - shift.time.start_mins,
        )

        const firstHour = getDateWithMuAnHAndS(
          new Date(
            new Date().setHours(
              shift.time.start_hour + 1,
              shift.time.start_mins,
            ),
          ),
          dateNow,
        )

        //know the last hour of shift
        const lastMins = Math.abs(
          shift.time.end_mins - new Date(Date.now()).getMinutes(),
        )
        const lastHour = getDateWithMuAnHAndS(
          new Date(
            new Date().setHours(shift.time.end_hour - 1, shift.time.end_mins),
          ),
          dateNow,
        )
        // if (firstHour.hours !== 0 || firstHour.minutes !== 0) {
        //   return res.status(400).send({
        //     error_en: `You must get out to break after the shift start with a hour the time left to get your break is ${firstHour.hours}:${firstHour.minutes}`,
        //   })
        // }

        // if (lastHour.hours == 0 && lastHour.minutes == 0) {
        //   return res.status(400).send({
        //     error_en: 'You cannt get out to break at last hour ',
        //   })
        // }

        // if the user dose not have a break
        if (
          getBreak &&
          !getBreak.break[0] &&
          (lastHour.left || firstHour.left)
        ) {
          endTime = addMinutes(dateNow, hourswithMins)
          const timeLeftSignO = getDateWithMuAnHAndS(endTime, dateNow)
          return (TimeBreak = {
            timeBreakStart: dateNow,
            timeBreakEnd: endTime,
            timeLeft: 0,
            signOute:
              timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
                ? { hours: timeLeftSignO.hours, muin: timeLeftSignO.minutes }
                : 0,
            isComplated: false,
            left: false,
          })
        }
        // if the user already signin for break
        else if (getBreak && getBreak.break[0]) {
          endTime = addMinutes(getBreak.break[0].start, hourswithMins)
          const timeLeftSignO = getDateWithMuAnHAndS(endTime, dateNow)
          return (TimeBreak = {
            timeBreakStart: getBreak.break[0].start,
            timeBreakEnd: endTime,
            timeLeft: 0,
            signOute:
              timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
                ? { hours: timeLeftSignO.hours, muin: timeLeftSignO.minutes }
                : 0,
            isComplated:
              timeLeftSignO.minutes == 0 && timeLeftSignO.hours == 0
                ? true
                : false,
            left: timeLeftSignO.left ? true : false,
          })
        }
        // else {

        //  return TimeBreak = {
        //     isComplated: true,
        //     left: true,
        //     timeLeft: 0,
        //   }
        // }
      }
      //................*
    })
  }

  // if user have a brek
  console.log(TimeBreak, 'aaaaaaaaaaaaaaa.....')

  if (TimeBreak && (!TimeBreak?.left || TimeBreak.isComplated)) {
    // if (TimeBreak?.timeBreakStart && TimeBreak?.timeBreakEnd) {
    // get break  if user do signin for break
    console.log(TimeBreak)

    const dateStart = new Date(
      new Date(TimeBreak?.timeBreakStart).setHours(
        new Date(TimeBreak?.timeBreakStart).getHours(),
        5,
      ),
    )
    const dateEnd = new Date(TimeBreak?.timeBreakEnd).toISOString()
    console.log('this frist hell ')
    console.log(dateStart)
    console.log(dateEnd)

    userBreak = await Attendance.findOne(
      {
        member: user._id,
        shift: shift._id,
        createdAt: {
          $gte: new Date(startToday).toISOString(),
          $lt: new Date(endToday).toISOString(),
        },
      },
      {
        break: {
          $elemMatch: {
            start: {
              $gte: dateStart,
              $lte: dateEnd,
            },
          },
        },
      },
    )
    console.log(userBreak, 'userBreak')

    console.log('this second hell ')

    // get break if user do sign out for break
    userBreakEnd = await Attendance.findOne(
      {
        member: user._id,
        shift: shift._id,
        createdAt: {
          $gte: new Date(startToday).toISOString(),
          $lt: new Date(endToday).toISOString(),
        },
      },
      {
        break: {
          $elemMatch: {
            start: {
              $gte: dateStart,
              $lt: dateEnd,
            },
            status: true,
          },
        },
      },
    )

    console.log(userBreakEnd, 'sadsad')

    // userBreak = await Attendance.findOne(
    //   {
    //     member: user._id,
    //     shift: shift._id,
    //   },

    //   { break: { $elemMatch: { start: TimeBreak.timeBreakStart } } },
    // )
    // // get break if user do sign out for break
    // userBreakEnd = await Attendance.findOne(
    //   {
    //     member: user._id,
    //     shift: shift._id,
    //     createdAt: {
    //       $gte: new Date(dateStartShift).toISOString(),
    //       $lt: new Date(dateEndtShift).toISOString(),
    //     },
    //   },
    //   { break: { $elemMatch: { end: TimeBreak.timeBreakEnd } } },
    // )
  }
  //to know the near time for overtime
  if (overtimes) {
    const userAtt: any = await Attendance.findOne(
      {
        member: user._id,
        createdAt: {
          $gte: new Date(startToday).toISOString(),
          $lt: new Date(endToday).toISOString(),
        },
      },
      {
        overTime: {
          $elemMatch: {
            signIn: { $lte: new Date(Date.now()) },
          },
        },
      },
    )
    console.log(userAtt, 'userAaa')

    overtimes.map((overTime: any) => {
      const StartOverTime = new Date(overTime.start) // >>> the time signin must be == time now or smaller time now
      const chakeDay = StartOverTime.getDay() === dateNow.getDay() // chake days
      const chakeMonth = StartOverTime.getMonth() === dateNow.getMonth() // chake months
      if (chakeDay && chakeMonth) {
        const timeLeftOverTime = getDateWithMuAnHAndS(overTime.start, dateNow)
        // to get time left for SignOut
        const timeLeftSignO = getDateWithMuAnHAndS(overTime.end, dateNow)
        if (
          timeLeftOverTime?.hours == 0 &&
          timeLeftOverTime?.minutes <= 59 &&
          (timeLeftSignO?.hours >= 0 || timeLeftSignO?.minutes >= 0)
        ) {
          // if found overtime return the time left
          if (timeLeftOverTime?.minutes != 0) {
            return (TimeOverTime = {
              timeOverStart: overTime.start,
              timeOverEnd: overTime.end,
              timeLeft: timeLeftOverTime.minutes,
            })
          } else if (
            timeLeftOverTime?.minutes <= 0 &&
            !userAtt?.overTime &&
            (timeLeftSignO?.hours > 0 || timeLeftSignO?.minutes > 0)
          ) {
            return (TimeOverTime = {
              timeOverStart: overTime.start,
              timeOverEnd: overTime.end,
              timeLeft: 0,
              _id: overTime._id,
            })
          }
          // if the time left is done
          else if (
            timeLeftOverTime?.minutes == 0 &&
            userAtt &&
            userAtt?.overTime &&
            !userAtt?.overTime[0]?.isCompleted
          ) {
            return (TimeOverTime = {
              timeOverStart: overTime?.start,
              timeOverEnd: overTime?.end,
              timeLeft: 0,
              signOute: {
                hours: timeLeftSignO.hours,
                mins: timeLeftSignO.minutes,
              },
              _id: overTime._id,
            })
          }
          // if time for sgin out is done
          else if (userAtt?.overTime && userAtt?.overTime[0]?.isCompleted) {
            return (TimeOverTime = undefined)
          }
        } else {
          return (TimeOverTime = false)
        }
      }
    })
  }
  // chakes for sginIn and sginOut (Breaks)
  const SginInOuteBreak = chakeDay && TimeBreak && userAttend && !TimeBreak.left
  // if time break time is not near so user try to sign in twice at the same  day
  console.log(timeToStartShift, 'dsadsdsadsdsdsadsadsadsadsadsadsa')

  if (
    chakeDay &&
    (!TimeBreak || TimeBreak?.left) &&
    timeSignOuSgift?.hours >= 1 &&
    userAttend &&
    (userBreakEnd?.break[0] || !userBreak?.break[0])
  ) {
    return res
      .status(400)
      .send({ error_en: `you already sign in for your shift for today ${new Date(Date.now())}` })
  }
  // if someone to sign in for break and the  break time in branch does not match the user time
  else if (
    SginInOuteBreak &&
    TimeBreak?.timeLeft <= 59 &&
    TimeBreak?.timeLeft != 0 &&
    !userBreak?.break[0]
  ) {
    return res.status(400).send({
      error_en: ` sigin for break , time left for break is  ${TimeBreak.timeLeft}  `,
    })
  }
  //if someone to sigoute must the  user time match the branch time (Break)
  else if (
    SginInOuteBreak &&
    TimeBreak?.timeLeft == 0 &&
    TimeBreak?.signOute?.hours <= 1 &&
    TimeBreak?.signOute?.muin != 0 &&
    userBreak?.break[0]
  ) {
    return res.status(400).send({
      error_en: ` to sign out from your break the time left for sign out for break is ${TimeBreak.signOute.hours} : ${TimeBreak.signOute.muin} `,
    })
  } else if (
    SginInOuteBreak &&
    userBreak?.break[0] &&
    TimeBreak?.timeLeft == 0 &&
    TimeBreak?.timeBreakStart &&
    (TimeBreak?.signOute?.hours >= 1 || TimeBreak?.signOute?.muin >= 0)
  ) {
    return res.status(400).send({
      error_en: `you already sgin in for break `,
    })
  }
  //if someone to sigoute must the  user time match the branch time for (Shift)
  // console.log(timeSignOuSgift.hours <= 1);
  else if (
    chakeDay &&
    TimeBreak?.left &&
    userAttend &&
    timeSignOuSgift?.minutes > 0 &&
    timeSignOuSgift?.hours == 0 &&
    !timeSignOuSgift.left &&
    (userBreak[0] ? userBreakEnd?.break[0] : true)
  ) {
    console.log('why did that')

    const timeLeft = getDateWithMuAnHAndS(dateEndtShift, dateNow)
    return res.status(400).send({
      error_en: `the time left for sign out from shift is ${timeLeft.hours}:${timeLeft.minutes}`,
    })
  }
  // if someone try to sign out twice at the same  day
  else if (
    timeSignOuSgift && // new updates 2
    timeSignOuSgift?.hours == 0 &&
    timeSignOuSgift?.minutes == 0 &&
    chakeDay &&
    userAttend &&
    userAttend?.isCompleted &&
    !TimeOverTime
    // TimeBreak.isComplated
  ) {
    res
      .status(400)
      .send({
        error_en: `You already sign out for tody `,
      })
  }
  //if the user have over time but the over time is not near to his time and also dose not have a shift for his today
  // && !TimeBreak 
  else if (!TimeOverTime&& timeToStartShift?.hours >= 1) {
    return res.send({ message_en: `You don't have any thing for now` })
  }
  // if user have a overtime
  else if (TimeOverTime) {
    //if the time left is not done for overTime start
    if (TimeOverTime.timeLeft) {
      return res.send({
        error_en: `The time left for overtime is : ${TimeOverTime.timeLeft} Mintes`,
      })
    }
    //if the time left is not done for overTime sign out
    else if (
      TimeOverTime &&
      TimeOverTime.signOute &&
      (TimeOverTime.signOute.hours != 0 || TimeOverTime.signOute.mins != 0)
    ) {
      return res.status(400).send({
        error_en: `The time left for sgin out from overtime is : ${TimeOverTime.signOute.hours}:${TimeOverTime.signOute.mins} `,
      })
    }
  }
  // I : must sign time match the branch time to accept the signIn( the time branch + half hour) [Shift , Break , overTime]]
  // II : should location user match the branch location to accept the signIn [Shift , Break , overTime] => soon

  if (chakeDay && !userAttend && !TimeOverTime && timeToStartShift?.hours < 1) {
    const timalate = timeLate(dateStartShift, dateNow)
    const earlyTime = originalTime(dateStartShift, dateNow)
    const attendanceFind = await Attendance.findOne({
      member: user._id,
      createdAt: { $gte: startToday, $lt: endToday },
    })
    if (attendanceFind) {
      await Attendance.updateOne(
        { member: user._id, createdAt: { $gte: startToday, $lt: endToday } },
        {
          $set: {
            originalTime: {
              hours: originTim.hours,
              mins: originTim.mins,
            },
            member: user._id,
            shift: shift._id,
            signIn: dateNow,
            lateHours: {
              hours: timalate.hours,
              mins: timalate.minutes,
            },
          },
        },
      )
    } else {
      const attendance = new Attendance({
        originalTime: {
          hours: originTim.hours,
          mins: originTim.mins,
        },
        member: user._id,
        shift: shift._id,
        signIn: dateNow,
        lateHours: {
          hours: timalate.hours,
          mins: timalate.minutes,
        },
        branch: user.branch,
        department: user.department,
      })
      attendance.save()
    }

    if (timalate.left) {
      return res.status(200).send({
        message_en: `you sucsses for signin for the day and you are late ${timalate.hours}:${timalate.minutes}  `,
        data: shift,
      })
    } else if (earlyTime.hours !== 0 || earlyTime.minutes !== 0) {
      return res.status(200).send({
        message_en: `you sucsses for signin for the day and you are not late and you are eraly ${earlyTime.hours}:${earlyTime.minutes}  `,
        data: shift,
      })
    } else {
      return res.status(200).send({
        message_en: `you sucsses for signin for the day and you are not late `,
        data: shift,
      })
    }
  }

  // chake time break and do (signin) for user if mach
  if (SginInOuteBreak && !userBreak?.break[0]) {
    // const originalTime = new Date(TimeBreak.timeBreakEnd.getHours()) - new Date(TimeBreak.timeBreakStart.getHours())
    const originalT = originalTime(
      TimeBreak.timeBreakEnd,
      TimeBreak.timeBreakStart,
    )
    await Attendance.updateOne(
      {
        member: user._id,
        shift: shift._id,
        createdAt: {
          $gte: new Date(dateStartShift).toISOString(),
          $lt: new Date(dateEndtShift).toISOString(),
        },
      },
      {
        $push: {
          break: {
            originalTime: {
              hours: originalT.hours,
              mins: originalT.minutes,
            },
            start: TimeBreak.timeBreakStart,
            signIn: dateNow,
          },
        },
      },
    )
    res.status(200).send({ message_en: 'You sucsses for sign in for break' })
  }
  console.log(TimeBreak, 'Time Breakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')

  // chake time break and do (signout) for user if mach
  if (
    chakeDay &&
    TimeBreak &&
    userAttend &&
    TimeBreak?.isComplated &&
    userBreak &&
    userBreak?.break &&
    userBreak?.break[0] &&
    !userBreakEnd?.break[0]
  ) {
    // const breakStartWithMinutesAndHours = (TimeBreak.timeBreakEnd.getHours() - 2) * 60 + (TimeBreak.timeBreakEnd.getMinutes())
    const timalate = timeLate(TimeBreak.timeBreakEnd, dateNow)
    await Attendance.updateOne(
      {
        member: user._id,
        shift: shift._id,
        createdAt: {
          $gte: new Date(dateStartShift).toISOString(),
          $lt: new Date(dateEndtShift).toISOString(),
        },
        'break._id': userBreak.break[0]._id,
      },
      {
        $set: {
          'break.$.end': TimeBreak.timeBreakEnd,
          'break.$.signOut': dateNow,
          'break.$.status': true,
          'break.$.lateHours': {
            hours: timalate.hours,
            mins: timalate.minutes,
          },
        },
      },
    )
    if (timalate.hours > 0 || timalate.minutes > 0) {
      res.status(200).send({
        message_en: `You sucsses for sign out from break and you are late ${timalate.hours}:${timalate.minutes}`,
      })
    } else {
      res.status(200).send({
        message_en: `You sucsses for sign out from break and you are not late`,
      })
    }
  }

  // chake time shift and do (sginOut) for user if mach

  if (
    shift &&
    timeSignOuSgift?.hours == 0 &&
    timeSignOuSgift?.minutes == 0 &&
    chakeDay &&
    userAttend &&
    !userAttend?.isCompleted
  ) {
    //time late for break
    let breakTime = {
      hours: 0,
      mins: 0,
    }
    for (let index = 0; index < userAttend.break.length; index++) {
      const element: any = userAttend.break[index]
      if (element.lateHours.hours) {
        breakTime.hours += element.lateHours.hours
        breakTime.mins += element.lateHours.mins
      }
    }
    // overAllTime
    const originalTime = timeLate(userAttend.signIn, dateNow)
    const overAllHours = originalTime.hours - breakTime.hours
    const overAllMins = Math.abs(originalTime.minutes - breakTime.mins)

    const contract: any = await Contract.findOne({
      employee: user._id,
    })
    const findPayrol = await Payrol.findOne({
      employee: user._id,
      type: 'shift',
      day: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    })
    const lateTime =
      (breakTime.hours + userAttend.lateHours.hours) * 60 +
      (userAttend.lateHours.mins + breakTime.mins)
    const TimeShift =
      userAttend.originalTime.hours * 60 + userAttend.originalTime.mins
    // const hoursWithMins =
    //   userAttend.lateHours.hours * 60 + userAttend.lateHours.mins >=
    //   userAttend.originalTime.hours * 60 + userAttend.originalTime.mins
    if (TimeShift >= lateTime) {
      await Attendance.updateOne(
        {
          member: user._id,
          shift: shift._id,
          createdAt: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
          },
        },
        {
          $set: {
            workingHours: {
              hours: overAllHours,
              mins: overAllMins,
            },
            isCompleted: true,
            signOut: dateNow,
          },
        },
      )
      // payrol
      const salryHours =
        contract &&
        contract.dailySalary /
          (shift.time.originalTime.hours * 60 + shift.time.originalTime.mins) /
          60

      const finalSalry =
        contract && salryHours * overAllHours + salryHours * overAllMins
      const payrol = new Payrol({
        type: 'shift',
        employee: user._id,
        day: dateNow,
        dailySalary: contract ? contract.dailySalary : 0,
        originalTime:
          shift.time.originalTime.hours + '.' + shift.time.originalTime.mins,
        lateTime: userAttend.lateHours.hours + '.' + userAttend.lateHours.mins,
        salary: contract ? finalSalry : 0,
        shift: shift._id,
        branch: user.branch,
        department: user.department,
      })
      !findPayrol && payrol.save()
      res.send({
        message_en: `You sucsses for sign out from shift and you working tody just ${overAllHours} : ${overAllMins}`,
      })
    } else {
      await Attendance.updateOne(
        {
          member: user._id,
          shift: shift._id,
          createdAt: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
          },
        },
        {
          $set: {
            workingHours: {
              hours: 0,
              mins: 0,
            },
            signOut: dateNow,
            isCompleted: true,
          },
        },
      )
      // payrol

      const payrol = new Payrol({
        type: 'shift',
        employee: user._id,
        day: dateNow,
        dailySalary: contract ? contract.dailySalary : 0,
        originalTime:
          shift.time.originalTime.hours + '.' + shift.time.originalTime.mins,
        lateTime: userAttend.lateHours.hours + '.' + userAttend.lateHours.mins,
        salary: 0,
        shift: shift._id,
        branch: user.branch,
        department: user.department,
      })
      res.send({
        message_en: `You success for sign out from shift and your time today is not allowed `,
      })
      !findPayrol && payrol.save()
    }

    // const payrol = new Payrol({
    //   employee: user._id,
    //   type: 'shift',
    //   day: new Date(Date.now()).getDay(),
    // })
  }
  //chake for overTime to singin and sgin out

  if (TimeOverTime && TimeOverTime?.timeLeft === 0) {
    const originTim: any = originalTime(
      TimeOverTime.timeOverEnd,
      TimeOverTime.timeOverStart,
    )
    const timalate: any = timeLate(TimeOverTime.timeOverStart, dateNow)
    const userAtt: any = await Attendance.findOne({
      member: user._id,
      shift: TimeOverTime._id,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
      overTime: { $elemMatch: { signIn: { $lte: new Date(Date.now()) } } },
    })
    let shiftUser: any = await Shift.findOne({
      branch: user.branch,
      _id: user.shift,
    })
    const userAttendedOver: any = await Attendance.findOne(
      {
        member: user._id,
        createdAt: {
          $gte: new Date(startToday).toISOString(),
          $lt: new Date(endToday).toISOString(),
        },
      },
      {
        overTime: {
          $elemMatch: {
            overId: TimeOverTime._id,
          },
        },
      },
    )

    const shiftAttend = await Attendance.findOne({
      member: user._id,
      shift: user.shift,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    })
    // if dose not exist ceate new shift
    if (!userAtt && !shiftAttend && !userAttendedOver?.overTime[0]) {
      const attend = new Attendance({
        overTime: {
          originalTime: {
            hours: originTim.hours,
            mins: originTim.minutes,
          },
          lateHours: {
            hours: timalate.hours,
            mins: timalate.minutes,
          },
          signIn: dateNow,
          overId: TimeOverTime._id,
        },
        shift: TimeOverTime._id,
        member: user._id,
        branch: user.branch,
        department: user.department,
      })
      attend.save()
      await Overtime.updateOne(
        { _id: TimeOverTime._id },
        {
          $push: {
            attendences: attend._id,
          },
        },
      )
      if (timalate?.hours == 0 && timalate?.minutes === 0) {
        return res.send({ message_en: `you succes sginIn for overTime` })
      } else {
        return res.send({
          message_en: `you succes sginIn for overTime and you are late ${timalate.hours}:${timalate.minutes}`,
        })
      }
    }
    // if exiest shift push overTime
    else if (!userAtt && shiftAttend && !userAttendedOver?.overTime[0]) {
      await Attendance.updateOne(
        {
          shift: user.shift,
          member: user._id,
          createdAt: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
          },
        },
        {
          $push: {
            overTime: {
              originalTime: {
                hours: originTim.hours,
                mins: originTim.minutes,
              },
              lateHours: {
                hours: timalate.hours,
                mins: timalate.minutes,
              },
              signIn: dateNow,
              overId: TimeOverTime._id,
            },
          },
        },
      )
      await Overtime.updateOne(
        { _id: TimeOverTime._id },
        {
          $push: {
            attendences: shiftAttend._id,
          },
        },
      )
      if (timalate.hours == 0 && timalate.minutes === 0) {
        return res.send({ message_en: `you succes sginIn for overTime` })
      } else {
        return res.send({
          message_en: `you succes sginIn for overTime and you are late ${timalate.hours}:${timalate.minutes}`,
        })
      }
    }
    //for sgin out form overTime
    else if (
      userAttendedOver?.overTime[0] &&
      !userAttendedOver?.overTime[0]?.isCompleted &&
      TimeOverTime &&
      TimeOverTime?.signOute &&
      TimeOverTime?.signOute.hours == 0 &&
      TimeOverTime?.signOute.mins == 0
    ) {
      // const lateHours = userAtt
      //   ? userAtt.overTime[0].lateHours.hours
      //   : userAttendedOver.overTime[0].lateHours.hours
      // const lateMins = userAtt
      //   ? userAtt.overTime[0].lateHours.mins
      //   : userAttendedOver.overTime[0].lateHours.mins
      // const originalHours = userAtt
      //   ? userAtt.overTime[0].originalTime.hours
      //   : userAttendedOver.overTime[0].originalTime.hours
      // const originalMins = userAtt
      //   ? userAtt.overTime[0].originalTime.mins
      //   : userAttendedOver.overTime[0].originalTime.mins
      const timeWorking = originalTime(
        dateNow,
        userAttendedOver.overTime[0].signIn,
      )
      await Attendance.updateOne(
        {
          member: user._id,
          createdAt: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
          },
          'overTime._id': userAttendedOver.overTime[0]._id,
        },
        {
          $set: {
            isCompleted: true,
            'overTime.$.signOut': dateNow,
            'overTime.$.isCompleted': true,
            'overTime.$.workingHours': {
              hours: timeWorking.hours,
              mins: timeWorking.minutes,
            },
          },
        },
      )
      const contract: any = await Contract.findOne({
        employee: user._id,
        endDate: { $gte: new Date(Date.now()) },
      })
      const lateTime = userAttendedOver.overTime[0].lateHours
      const salryHours =
        contract &&
        (contract.dailySalary /
          (shiftUser?.time?.originalTime.hours * 60 +
            shiftUser.time.originalTime.mins)) *
          60
      const finalSalry =
        contract &&
        salryHours * timeWorking.hours + (salryHours / 60) * timeWorking.minutes
      // const findPayrol = await Payrol.findOne({
      //   employee: user._id,
      //   type: 'overtime',
      //   day: {
      //     $gte: new Date(startToday).toISOString(),
      //     $lt: new Date(endToday).toISOString(),
      //   },
      // })
      const payrol = new Payrol({
        type: 'overtime',
        employee: user._id,
        day: dateNow,
        dailySalary: contract ? contract.dailySalary : 0,
        originalTime:
          shiftUser.time.originalTime.hours +
          '.' +
          shiftUser.time.originalTime.mins,
        lateTime: lateTime.hours + '.' + lateTime.mins,
        salary: contract ? finalSalry : 0,
        shift: shiftUser._id,
        branch: user.branch,
        department: user.department,
      })
      payrol.save()

      return res.send({ message_en: `you succes sgin out from overTime` })
    }

    //else if (
    //   TimeOverTime &&
    //   TimeOverTime.signOute.hours !== 0 &&
    //   TimeOverTime.signOute.mins !== 0
    // ) {
    //   res.send({ message_en: `the time left for sign out from shift is ${TimeOverTime.signOute.hours}:${TimeOverTime.signOute.minutes}` })
    // }
    // else if (userAttend) {
    //     await Attendance.updateOne({ shift: shift._id, member: user._id }, {
    //         $push: {
    //             originalTime: {
    //                 hours: originTim.hours,
    //                 mins: originTim.minutes
    //             },
    //             lateHours: {
    //                 hours: timalate.hours,
    //                 mins: timalate.minutes

    //             },
    //             signIn: dateNow
    //         }
    //     })
    //     await Overtime.updateOne({ _id: TimeOverTime._id }, {
    //         $push: {
    //             attendences: userAttend._id
    //         }
    //     })
    //     if (timalate.hours == 0 || timalate.minutes == 0) {
    //         return res.send({ message_en: `you succes sginIn for overTime` })

    //     } else {
    //         return res.send({ message_en: `you succes sginIn for overTime and you are late ${timalate.hours}:${timalate.minutes}` })
    //     }
    // }
    // else if (userAttend && !userAttend.overTime[0].isCompleted && TimeOverTime && TimeOverTime.signOute.hours == 0 && TimeOverTime.signOute.mins == 0) {
    //     await Attendance.updateOne({ shift: TimeOverTime._id, member: user._id, "overTime._id": userAtt.overTime[0]._id }, {
    //         $set: {
    //             "overTime.$.signOut": dateNow,
    //             "overTime.$.isCompleted": true
    //         }
    //     })
    //     TimeOverTime = false
    //     return res.send({ message_en: `you succes sgin out from overTime` })
    // }
  }
  //if user already sin out for toady
}

export const getStatusAttendToday = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const user: any = req.user
  const attend = await Attendance.findOne({
    member: user._id,
    shift: user.shift,
    createdAt: {
      $gte: new Date(startToday).toISOString(),
      $lt: new Date(endToday).toISOString(),
    },
  })
  if (!attend)
    return res.status(200).send({
      message_en:
        "Maybe you do not signIn for today or you don't have shift for today",
      message_ar:
        'ربما لم تقم بتسجيل الدخول لهذا اليوم أو ليس لديك وردية اليوم',
    })
  return res.send({ attend, success: true })
}
export const getAllAttendforUsers = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  let attends: any
  if (req.user?.role === Roles.EMPLOYEE) {
    console.log('fuck')

    attends = await Attendance.find({
      member: req.user?._id,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    }).populate('member')
  } else {
    const { branch, department, company } = req.query
    const branches = (await Branch.find({ company: company })).map((branch) =>
      branch._id.toString(),
    )
    const filter = {
      branch: company && branches,
      department: department && department,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    }
    !department && delete filter.department
    attends = await Attendance.find(filter).populate('member')
  }

  if (!attends[0])
    return res
      .status(400)
      .send({ error_en: 'no attende found for an employee' })
  return res.send({
    attends,
    success: true,
  })
}
export const getAllAttendforEmployee = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const { _id, shift }: any = req.user
  const attends = await Attendance.find({
    member: _id,
    shift: shift,
  })
  if (!attends[0])
    return res.status(400).send({ error_en: 'no attende found yet..' })
  return res.send({
    attends,
    success: true,
  })
}
export const getAllCountForEveryYear = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  let company: any = req.query.company
  let attendences: any = []
  if (req.user?.role === Roles.EMPLOYEE) {
    attendences = await Attendance.find({ member: req.user._id })
  } else if (req.user?.role === Roles.ADMIN || req.user?.role === Roles.ROOT) {
    req.user?.role === Roles.ADMIN
      ? (company = req.user?.company)
      : (company = req.query.company)
    const branches = (await Branch.find({ company: company })).map((branch) =>
      branch._id.toString(),
    )
    attendences = await Attendance.find({ branch: branches })
  }
  let years: any = {}
  // get uineq years
  for (let index = 0; index < attendences.length; index++) {
    const attend: any = attendences[index]
    !years[new Date(attend.createdAt).getFullYear()]
      ? (years[new Date(attend.createdAt).getFullYear()] = {
          complate: 0,
          uncomplate: 0,
        })
      : years[new Date(attend.createdAt).getFullYear()]
  }

  //for get count
  for (let index = 0; index < attendences.length; index++) {
    const attend: any = attendences[index]
    attend.isCompleted
      ? (years[new Date(attend.createdAt).getFullYear()].complate += 1)
      : (years[new Date(attend.createdAt).getFullYear()].uncomplate += 1)
  }
  console.log(years)

  res.send({
    attendences,
    years,
  })
}
// ? years[new Date(attend.createdAt).getFullYear()]?.isComplated
// ? (years[
//     new Date(attend.createdAt).getFullYear()
//   ].isComplated += 1)
// : 0
// : years[new Date(attend.createdAt).getFullYear()].isComplated,
