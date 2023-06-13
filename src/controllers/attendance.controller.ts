import { Attendance } from "../models/attendance";
import { Shift } from "../models/shift";
import { Overtime } from "../models/overtime";
import { Break } from "../models/break";
import { Branch } from "../models/branch";
import { Response } from "express";
import { AuthenticatedReq } from "../middlewares/auth";
import User from "../models/user";
import { getDistance } from "../helpers/distance.helper";
import {
  addMinutes,
  getDateWithHoursAndMins,
  originalTime,
  timeLate,
} from "../helpers/time.helper";
import Payroll from "../models/payroll";
import Contract from "../models/contract";
import { Roles } from "../types/enums";


const startToday = new Date(new Date().setHours(1, 59));
const endToday = new Date(new Date().setHours(24, 59));

export const attend = async (req: AuthenticatedReq, res: Response) =>
{
  const MIN_ACCURACY = 0.2; // km

  // get user with the branch and shift [User]
  //........................................#
  const dateNow: any = new Date(Date.now()); // date for now

  const user: any = await User.findById(req.user?._id);
  if (!user || !user.branch) {
    return res
      .status(404)
      .send({ error_en: "The user with any branch was not found" });
  }
  //get branch and check the user in the shift work
  const branch: any = await Branch.findOne({
    _id: user.branch,
    shift: user.shift,
  });

  if (!branch) {
    return res
      .status(404)
      .send({ error_en: "The branch with the given user shift was not found" });
  }
  // get Break
  const breaks: any = await Break.find({
    users: { $elemMatch: { $eq: user._id } },
  });
  //get overTime
  const overtimes: any = await Overtime.find({
    users: { $elemMatch: { $eq: user._id } },
    start: {
      $gte: new Date(startToday).toISOString(),
      $lt: new Date(endToday).toISOString(),
    },
  });
  console.log(new Date(endToday).getDay());

  //get shift with the branch
  let shift: any = await Shift.findOne({
    branch: user.branch,
    _id: user.shift,
    originalDays: { $in: dateNow.getDay() },
  });

  // if the time shift not mache time now and the user dose not have any overtime for the day
  if (!shift && !overtimes[0]) {
    return res.status(200).send({
      message_en:
        "you don't have any shift for now and also don't have any overtime , maybe the day is holiday",
    });
  }
  // Check for attendance location
  const {
    lat,
    long,
    radius,
  } = req.body;
  const branchLat = branch.location.lat;
  const branchLong = branch.location.long;
  const distance = getDistance(lat, long, branchLat, branchLong);
  if (distance > MIN_ACCURACY) {
    return res
      .status(400)
      .send(
        "your location doesn't match the branch location. Please, make sure you use your phone",
      );
  }
  //get user with attendance to check
  let userAttend: any;
  //........................................*
  // get the data the attendance need to created
  //............................................................#
  //...............................................................#
  // must  user location match branch location to accept sign [Shift]
  // soon will be valid *
  //...............................................................*
  let dateStartShift: any;
  let checkDay: any;
  let timeSignOutShift: any;
  let timeToStartShift: any;
  let dateEndShift: any;

  // originTime for user shift
  let originTim: any;

  // must have a shift to a assign those properties
  if (shift) {
    dateStartShift = new Date(
      new Date().setHours(
        shift.time.start_hour,
        shift.time.start_mins && shift.time.start_mins,
      ),
    ); // >>> the sign-in time must be == time now or smaller time now
    dateEndShift = new Date(
      new Date().setHours(
        shift.time.end_hour,
        shift.time.end_mins && shift.time.end_mins,
      ),
    );

    // >>> the sign-in time must be == time now or smaller time now
    userAttend = await Attendance.findOne({
      member: user._id,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    });
    checkDay = shift.originalDays.includes(dateNow.getDay()); // check days
    // const addMinutesDateNow = addMinutes(dateNow, 30) // >>> after add 30 minutes to time now
    originTim = shift.time.originalTime;
    // collect the time left for  sing out from shift
    timeSignOutShift = getDateWithHoursAndMins(dateEndShift, dateNow);
    timeToStartShift = getDateWithHoursAndMins(dateStartShift, dateNow);
  }

  // time late
  // for break && sign out of all
  let TimeBreak: any;
  let userBreak: any;
  let userBreakEnd: any;
  let TimeOverTime: any;
  // to know the near time for (TimeBreak , TimeSignOutBreak )
  if (checkDay) {
    let getBreak: any = await Attendance.findOne({
      member: user._id,
      shift: shift._id,
      createdAt: {
        $gte: new Date(dateStartShift).toISOString(),
        $lt: new Date(dateEndShift).toISOString(),
      },
    });
    console.log(breaks);

    if (!breaks[0]) {
      TimeBreak = {
        left: true,
      };
    }

    breaks.map((br: any) =>
    {
      //................#
      // to get time left for break and return the near sign-in
      console.log(br);

      const startDate = new Date(
        new Date().setHours(br.start.hours, br.start.mins),
      );
      const endDate = new Date(new Date().setHours(br.end.hours, br.end.mins));

      const timeLeftBreak = getDateWithHoursAndMins(startDate, dateNow);

      // to get time left for SignOut
      const timeLeftSignO = getDateWithHoursAndMins(endDate, dateNow);
      // just if time left to sign and sign out and the break is not open
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
          signOut:
            timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
              ? {
                hours: timeLeftSignO.hours,
                muin: timeLeftSignO.minutes,
              }
              : 0,
          isCompleted:
            timeLeftSignO.minutes == 0 && timeLeftSignO.hours == 0
              ? true
              : false,
          left: timeLeftSignO.left ? true : false,
        });
      }
      // if the break is open must the user get out in any time for break
      else if (br.isOpen && userAttend) {
        console.log("yabaaa");

        let endTime;
        // to add the time for break
        const hoursWithMins = br.duration.hours * 60 + br.duration.mins;
        //know first hour for break open
        const firstMins = Math.abs(
          new Date(Date.now()).getMinutes() - shift.time.start_mins,
        );

        const firstHour = getDateWithHoursAndMins(
          new Date(
            new Date().setHours(
              shift.time.start_hour + 1,
              shift.time.start_mins,
            ),
          ),
          dateNow,
        );

        //know the last hour of shift
        const lastMins = Math.abs(
          shift.time.end_mins - new Date(Date.now()).getMinutes(),
        );
        const lastHour = getDateWithHoursAndMins(
          new Date(
            new Date().setHours(shift.time.end_hour - 1, shift.time.end_mins),
          ),
          dateNow,
        );
        // if (firstHour.hours !== 0 || firstHour.minutes !== 0) {
        //   return res.status(400).send({
        //     error_en: `You must get out to break after the shift start with a hour the time left to get your break is ${firstHour.hours}:${firstHour.minutes}`,
        //   })
        // }

        // if (lastHour.hours == 0 && lastHour.minutes == 0) {
        //   return res.status(400).send({
        //     error_en: 'You cannot get out to break at last hour ',
        //   })
        // }

        // if the user does not have a break
        if (
          getBreak &&
          !getBreak.break[0] &&
          (lastHour.left || firstHour.left)
        ) {
          endTime = addMinutes(dateNow, hoursWithMins);
          const timeLeftSignO = getDateWithHoursAndMins(endTime, dateNow);
          return (TimeBreak = {
            timeBreakStart: dateNow,
            timeBreakEnd: endTime,
            timeLeft: 0,
            signOut:
              timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
                ? {
                  hours: timeLeftSignO.hours,
                  muin: timeLeftSignO.minutes,
                }
                : 0,
            isCompleted: false,
            left: false,
          });
        }
        // if the user already sign-in for break
        else if (getBreak && getBreak.break[0]) {
          endTime = addMinutes(getBreak.break[0].start, hoursWithMins);
          const timeLeftSignOut = getDateWithHoursAndMins(endTime, dateNow);
          return (TimeBreak = {
            timeBreakStart: getBreak.break[0].start,
            timeBreakEnd: endTime,
            timeLeft: 0,
            signOut:
              timeLeftSignOut.hours >= 0 || timeLeftSignOut.minutes >= 0
                ? {
                  hours: timeLeftSignOut.hours,
                  muin: timeLeftSignOut.minutes,
                }
                : 0,
            isCompleted:
              timeLeftSignOut.minutes == 0 && timeLeftSignOut.hours == 0
                ? true
                : false,
            left: timeLeftSignOut.left ? true : false,
          });
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
    });
  }

  // if user have a break
  console.log("Time break: ", TimeBreak);

  if (TimeBreak && (!TimeBreak?.left || TimeBreak.isCompleted)) {
    // if (TimeBreak?.timeBreakStart && TimeBreak?.timeBreakEnd) {
    // get break  if user do sign-in for break
    console.log(TimeBreak);

    const dateStart = TimeBreak?.timeBreakStart;
    const dateEnd = new Date(TimeBreak?.timeBreakEnd);
    console.log("this first hell ");
    console.log(dateStart);
    console.log(dateEnd);

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
              $lt: dateEnd,
            },
          },
        },
      },
    );

    console.log("this second hell ");

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
    );

    console.log("User Break End:", userBreakEnd);
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
    );
    console.log(userAtt, "userAt");

    overtimes.map((overTime: any) =>
    {
      const StartOverTime = new Date(overTime.start); // >>> the time sign-in must be == time now or smaller
      // time now
      const checkDay = StartOverTime.getDay() === dateNow.getDay(); // check days
      const checkMonth = StartOverTime.getMonth() === dateNow.getMonth(); // check months
      if (checkDay && checkMonth) {
        const timeLeftOverTime = getDateWithHoursAndMins(overTime.start, dateNow);
        // to get time left for SignOut
        const timeLeftSignO = getDateWithHoursAndMins(overTime.end, dateNow);
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
            });
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
            });
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
              signOut: {
                hours: timeLeftSignO.hours,
                mins: timeLeftSignO.minutes,
              },
              _id: overTime._id,
            });
          }
          // if time for sign out is done
          else if (userAtt?.overTime && userAtt?.overTime[0]?.isCompleted) {
            return (TimeOverTime = undefined);
          }
        } else {
          return (TimeOverTime = false);
        }
      }
    });
  }
  // check for sign-in and sign-out (Breaks)
  const signInOutBreak = checkDay && TimeBreak && userAttend && !TimeBreak.left;
  // if time break time is not near so user try to sign in twice at the same  day
  console.log(timeSignOutShift);

  if (
    checkDay &&
    (!TimeBreak || TimeBreak?.left) &&
    timeSignOutShift?.hours >= 1 &&
    userAttend &&
    (userBreakEnd?.break[0] || !userBreak?.break[0])
  ) {
    return res
      .status(400)
      .send({ error_en: `you already sign in for your shift for today` });
  }
  // if someone to sign in for break and the  break time in branch does not match the user time
  else if (
    signInOutBreak &&
    TimeBreak?.timeLeft <= 59 &&
    TimeBreak?.timeLeft != 0 &&
    userBreak?.break[0]
  ) {
    return res.status(400).send({
      error_en: ` sign for break , time left for break is  ${ TimeBreak.timeLeft }  `,
    });
  }
  //if someone to sign out must the  user time match the branch time (Break)
  else if (
    signInOutBreak &&
    TimeBreak?.timeLeft == 0 &&
    TimeBreak?.signOut?.hours <= 1 &&
    TimeBreak?.signOut?.muin != 0 &&
    userBreak?.break[0]
  ) {
    return res.status(400).send({
      error_en: ` to sign out from your break the time left for sign out for break is ${ TimeBreak.signOut.hours } : ${ TimeBreak.signOut.muin } `,
    });
  } else if (
    signInOutBreak &&
    userBreak?.break[0] &&
    TimeBreak?.timeLeft == 0 &&
    TimeBreak?.timeBreakStart &&
    (TimeBreak?.signOut?.hours >= 1 || TimeBreak?.signOut?.muin >= 0)
  ) {
    return res.status(400).send({
      error_en: `you already sign in for break `,
    });
  }
    //if someone to sign-out user time must match the branch time for (Shift)
  // console.log(timeSignOutShift.hours <= 1);
  else if (
    checkDay &&
    (TimeBreak?.left || !TimeBreak?.left) &&
    userAttend &&
    timeSignOutShift?.minutes > 0 &&
    timeSignOutShift?.hours == 0
  ) {
    const timeLeft = getDateWithHoursAndMins(dateEndShift, dateNow);
    return res.status(400).send({
      error_en: `the time left for sign out from shift is ${ timeLeft.hours }:${ timeLeft.minutes }`,
    });
  }
  // if someone try to sign out twice at the same  day
  else if (
    timeSignOutShift && // new updates 2
    timeSignOutShift?.hours == 0 &&
    timeSignOutShift?.minutes == 0 &&
    checkDay &&
    userAttend &&
    userAttend?.isCompleted &&
    !TimeOverTime
    // TimeBreak.isComplated
  ) {
    res.status(400).send({ error_en: "You already sign out for today" });
  }
  //if the user have over time but the over time is not near to his time and also does not have a shift for his today
  else if (!TimeOverTime && !TimeBreak && timeToStartShift?.hours >= 1) {
    return res.send({ message_en: `You don't have any thing for now` });
  }
  // if user have a overtime
  else if (TimeOverTime) {
    //if the time left is not done for overTime start
    if (TimeOverTime.timeLeft) {
      return res.send({
        error_en: `The time left for overtime is : ${ TimeOverTime.timeLeft } Minutes`,
      });
    }
    //if the time left is not done for overTime sign out
    else if (
      TimeOverTime &&
      TimeOverTime.signOut &&
      (TimeOverTime.signOut.hours != 0 || TimeOverTime.signOut.mins != 0)
    ) {
      return res.status(400).send({
        error_en: `The time left for sign out from overtime is : ${ TimeOverTime.signOut.hours }:${ TimeOverTime.signOut.mins } `,
      });
    }
  }
  // I : must sign time match the branch time to accept the signIn( the time branch + half hour) [Shift , Break , overTime]]
  // II : should location user match the branch location to accept the signIn [Shift , Break , overTime] => soon

  if (checkDay && !userAttend && !TimeOverTime && timeToStartShift?.hours < 1) {
    const timalate = timeLate(dateStartShift, dateNow);
    const earlyTime = originalTime(dateStartShift, dateNow);
    const attendanceFind = await Attendance.findOne({
      member: user._id,
      createdAt: {
        $gte: startToday,
        $lt: endToday,
      },
    });
    if (attendanceFind) {
      await Attendance.updateOne(
        {
          member: user._id,
          createdAt: {
            $gte: startToday,
            $lt: endToday,
          },
        },
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
      );
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
      });
      await attendance.save();
    }

    if (timalate.left) {
      return res.status(200).send({
        message_en: `you success for sign-in for the day and you are late ${ timalate.hours }:${ timalate.minutes }`,
        data: shift,
      });
    } else if (earlyTime.hours !== 0 || earlyTime.minutes !== 0) {
      return res.status(200).send({
        message_en: `You success for sign-in for the day and you are not late and you are early ${ earlyTime.hours }:${ earlyTime.minutes }  `,
        data: shift,
      });
    } else {
      return res.status(200).send({
        message_en: "You successfully signed in today and you are not late",
        data: shift,
      });
    }
  }

  // check time break and do (signin) for user if mach
  if (signInOutBreak && !userBreak?.break[0]) {
    // const originalTime = new Date(TimeBreak.timeBreakEnd.getHours()) - new Date(TimeBreak.timeBreakStart.getHours())
    const originalT = originalTime(
      TimeBreak.timeBreakEnd,
      TimeBreak.timeBreakStart,
    );
    await Attendance.updateOne(
      {
        member: user._id,
        shift: shift._id,
        createdAt: {
          $gte: new Date(dateStartShift).toISOString(),
          $lt: new Date(dateEndShift).toISOString(),
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
    );
    res.status(200).send({ message_en: "You success for sign in for break" });
  }
  // check time break and do (sign-out) for user if mach
  if (
    checkDay &&
    TimeBreak &&
    userAttend &&
    TimeBreak?.isCompleted &&
    userBreak &&
    userBreak?.break &&
    userBreak?.break[0] &&
    userBreakEnd &&
    !userBreakEnd?.break[0]
  ) {
    // const breakStartWithMinutesAndHours = (TimeBreak.timeBreakEnd.getHours() - 2) * 60 + (TimeBreak.timeBreakEnd.getMinutes())
    const timeLate1 = timeLate(TimeBreak.timeBreakEnd, dateNow);
    await Attendance.updateOne(
      {
        member: user._id,
        shift: shift._id,
        createdAt: {
          $gte: new Date(dateStartShift).toISOString(),
          $lt: new Date(dateEndShift).toISOString(),
        },
        "break._id": userBreak.break[0]._id,
      },
      {
        $set: {
          "break.$.end": TimeBreak.timeBreakEnd,
          "break.$.signOut": dateNow,
          "break.$.status": true,
          "break.$.lateHours": {
            hours: timeLate1.hours,
            mins: timeLate1.minutes,
          },
        },
      },
    );
    if (timeLate1.hours > 0 || timeLate1.minutes > 0) {
      res.status(200).send({
        message_en: `You successfully signed out from break and you are late ${ timeLate1.hours }:${ timeLate1.minutes }`,
      });
    } else {
      res.status(200).send({
        message_en: `You successfully for signed out from break and you are not late`,
      });
    }
  }

  // check time shift and do (sign out) for user if mach

  if (
    shift &&
    timeSignOutShift?.hours == 0 &&
    timeSignOutShift?.minutes == 0 &&
    checkDay &&
    userAttend &&
    !userAttend?.isCompleted
  ) {
    //time late for break
    let breakTime = {
      hours: 0,
      mins: 0,
    };
    for (let index = 0; index < userAttend.break.length; index++) {
      const element: any = userAttend.break[index];
      if (element.lateHours.hours) {
        breakTime.hours += element.lateHours.hours;
        breakTime.mins += element.lateHours.mins;
      }
    }
    // overAllTime
    const originalTime = timeLate(userAttend.signIn, dateNow);
    const overAllHours = originalTime.hours - breakTime.hours;
    const overAllMins = Math.abs(originalTime.minutes - breakTime.mins);

    const contract: any = await Contract.findOne({
      employee: user._id,
    });
    const finalPayroll = await Payroll.findOne({
      employee: user._id,
      type: "shift",
      day: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    });
    const lateTime =
      (breakTime.hours + userAttend.lateHours.hours) * 60 +
      (userAttend.lateHours.mins + breakTime.mins);
    const TimeShift =
      userAttend.originalTime.hours * 60 + userAttend.originalTime.mins;

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
      );
      // payroll
      const salaryHours =
        contract &&
        (contract.dailySalary /
          (shift.time.originalTime.hours * 60 + shift.time.originalTime.mins)) /
        60;

      const finalSalary =
        contract && salaryHours * overAllHours + (salaryHours) * overAllMins;
      const payroll = new Payroll({
        type: "shift",
        employee: user._id,
        day: dateNow,
        dailySalary: contract ? contract.dailySalary : 0,
        originalTime:
          shift.time.originalTime.hours + "." + shift.time.originalTime.mins,
        lateTime: userAttend.lateHours.hours + "." + userAttend.lateHours.mins,
        salary: contract ? finalSalary : 0,
        shift: shift._id,
        branch: user.branch,
        department: user.department,
      });
      !finalPayroll && await payroll.save();
      res.send({
        message_en: `You success for sign out from shift and you working today just ${ overAllHours } : ${ overAllMins }`,
      });
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
      );
      // payroll

      const payroll = new Payroll({
        type: "shift",
        employee: user._id,
        day: dateNow,
        dailySalary: contract ? contract.dailySalary : 0,
        originalTime:
          shift.time.originalTime.hours + "." + shift.time.originalTime.mins,
        lateTime: userAttend.lateHours.hours + "." + userAttend.lateHours.mins,
        salary: 0,
        shift: shift._id,
        branch: user.branch,
        department: user.department,
      });
      res.send({
        message_en: `You success for sign out from shift and your time today is not allowed`,
      });
      !finalPayroll && await payroll.save();
    }

    // const payroll = new Payroll({
    //   employee: user._id,
    //   type: 'shift',
    //   day: new Date(Date.now()).getDay(),
    // })
  }
  //check for overTime to sign in and sign out

  if (TimeOverTime && TimeOverTime?.timeLeft === 0) {
    console.log("is here");

    const originTim: any = originalTime(
      TimeOverTime.timeOverEnd,
      TimeOverTime.timeOverStart,
    );
    const timeLate1: any = timeLate(TimeOverTime.timeOverStart, dateNow);
    const userAtt: any = await Attendance.findOne({
      member: user._id,
      shift: TimeOverTime._id,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
      overTime: { $elemMatch: { signIn: { $lte: new Date(Date.now()) } } },
    });
    let shiftUser: any = await Shift.findOne({
      branch: user.branch,
      _id: user.shift,
    });
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
    );

    const shiftAttend = await Attendance.findOne({
      member: user._id,
      shift: user.shift,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    });
    //  create new shift if it does not exist
    if (!userAtt && !shiftAttend && !userAttendedOver?.overTime[0]) {
      const attend = new Attendance({
        overTime: {
          originalTime: {
            hours: originTim.hours,
            mins: originTim.minutes,
          },
          lateHours: {
            hours: timeLate1.hours,
            mins: timeLate1.minutes,
          },
          signIn: dateNow,
          overId: TimeOverTime._id,
        },
        shift: TimeOverTime._id,
        member: user._id,
        branch: user.branch,
        department: user.department,
      });
      await attend.save();
      await Overtime.updateOne(
        { _id: TimeOverTime._id },
        {
          $push: {
            attendances: attend._id,
          },
        },
      );
      if (timeLate1?.hours == 0 && timeLate1?.minutes === 0) {
        return res.send({ message_en: `you successfully signed in for overTime` });
      } else {
        return res.send({
          message_en: `you successfully signed in for overTime and you are late ${ timeLate1.hours }:${ timeLate1.minutes }`,
        });
      }
    }
    // if exists shift push overTime
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
                hours: timeLate1.hours,
                mins: timeLate1.minutes,
              },
              signIn: dateNow,
              overId: TimeOverTime._id,
            },
          },
        },
      );
      await Overtime.updateOne(
        { _id: TimeOverTime._id },
        {
          $push: {
            attendances: shiftAttend._id,
          },
        },
      );
      if (timeLate1.hours == 0 && timeLate1.minutes === 0) {
        return res.send({ message_en: `you successfully signed in for overTime` });
      } else {
        return res.send({
          message_en: `you successfully signed in for overTime and you are late ${ timeLate1.hours }:${ timeLate1.minutes }`,
        });
      }
    }
    //for sign out form overTime
    else if (
      userAttendedOver?.overTime[0] &&
      !userAttendedOver?.overTime[0]?.isCompleted &&
      TimeOverTime &&
      TimeOverTime?.signOut &&
      TimeOverTime?.signOut.hours == 0 &&
      TimeOverTime?.signOut.mins == 0
    ) {

      const timeWorking = originalTime(
        dateNow,
        userAttendedOver.overTime[0].signIn,
      );
      await Attendance.updateOne(
        {
          member: user._id,
          createdAt: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
          },
          "overTime._id": userAttendedOver.overTime[0]._id,
        },
        {
          $set: {
            isCompleted: true,
            "overTime.$.signOut": dateNow,
            "overTime.$.isCompleted": true,
            "overTime.$.workingHours": {
              hours: timeWorking.hours,
              mins: timeWorking.minutes,
            },
          },
        },
      );
      const contract: any = await Contract.findOne({
        employee: user._id,
        endDate: { $gte: new Date(Date.now()) },
      });
      const lateTime = userAttendedOver.overTime[0].lateHours;
      const salaryHours =
        contract &&
        (contract.dailySalary /
          (shiftUser?.time?.originalTime.hours * 60 +
            shiftUser.time.originalTime.mins)) *
        60;
      const finalSalary =
        contract &&
        salaryHours * timeWorking.hours + (salaryHours / 60) * timeWorking.minutes;

      const payroll = new Payroll({
        type: "overtime",
        employee: user._id,
        day: dateNow,
        dailySalary: contract ? contract.dailySalary : 0,
        originalTime:
          shiftUser.time.originalTime.hours +
          "." +
          shiftUser.time.originalTime.mins,
        lateTime: lateTime.hours + "." + lateTime.mins,
        salary: contract ? finalSalary : 0,
        shift: shiftUser._id,
        branch: user.branch,
        department: user.department,
      });
      await payroll.save();

      return res.send({ message_en: "you successfully signed out from overTime" });
    }
  }

};

export const getAttendStatusToday = async (
  req: AuthenticatedReq,
  res: Response,
) =>
{
  const user: any = req.user;
  const attend = await Attendance.findOne({
    member: user._id,
    shift: user.shift,
    createdAt: {
      $gte: new Date(startToday).toISOString(),
      $lt: new Date(endToday).toISOString(),
    },
  });
  if (!attend) {
    return res.status(200).send({
      message_en:
        "Maybe you do not signIn for today or you don't have shift for today",
      message_ar:
        "ربما لم تقم بتسجيل الدخول لهذا اليوم أو ليس لديك وردية اليوم",
    });
  }
  return res.send({
    data: attend,
    success: true,
  });
};
export const getAllUsersAttendees = async (
  req: AuthenticatedReq,
  res: Response,
) =>
{
  let attends: any;
  if (req.user?.role === Roles.EMPLOYEE) {
    console.log("fuck");

    attends = await Attendance.find({
      member: req.user?._id,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    }).populate("member");
  } else {
    const {
      branch,
      department,
      company,
    } = req.query;
    const branches = (await Branch.find({ company: company })).map((branch) =>
      branch._id.toString(),
    );
    const filter = {
      branch: company && branches,
      department: department && department,
      createdAt: {
        $gte: new Date(startToday).toISOString(),
        $lt: new Date(endToday).toISOString(),
      },
    };
    !department && delete filter.department;
    attends = await Attendance.find(filter).populate("member");
  }

  if (!attends[0]) {
    return res
      .status(400)
      .send({ error_en: "no attendance found for an employee" });
  }
  return res.send({
    data: attends,
    success: true,
  });
};
export const getAllAttendanceForEmployee = async (
  req: AuthenticatedReq,
  res: Response,
) =>
{
  const {
    _id,
    shift,
  }: any = req.user;
  const attends = await Attendance.find({
    member: _id,
    shift: shift,
  });
  if (!attends[0]) {
    return res.status(400).send({ error_en: "no attendance found yet.." });
  }
  return res.send({
    data: attends,
    success: true,
  });
};
export const getAllCountForEveryYear = async (
  req: AuthenticatedReq,
  res: Response,
) =>
{
  let company: any = req.query.company;
  let attendances: any = [];
  if (req.user?.role === Roles.EMPLOYEE) {
    attendances = await Attendance.find({ member: req.user._id });
  } else if (req.user?.role === Roles.ADMIN || req.user?.role === Roles.ROOT) {
    req.user?.role === Roles.ADMIN
      ? (company = req.user?.company)
      : (company = req.query.company);
    const branches = (await Branch.find({ company: company })).map((branch) =>
      branch._id.toString(),
    );
    attendances = await Attendance.find({ branch: branches });
  }
  let years: any = {};
  // get unique years
  for (let index = 0; index < attendances.length; index++) {
    const attend: any = attendances[index];
    !years[new Date(attend.createdAt).getFullYear()]
      ? (years[new Date(attend.createdAt).getFullYear()] = {
        completed: 0,
        uncompleted: 0,
      })
      : years[new Date(attend.createdAt).getFullYear()];
  }

  //for get count
  for (let index = 0; index < attendances.length; index++) {
    const attend: any = attendances[index];
    attend.isCompleted
      ? (years[new Date(attend.createdAt).getFullYear()].complate += 1)
      : (years[new Date(attend.createdAt).getFullYear()].uncomplate += 1);
  }
  console.log(years);

  res.send({
    attendances: attendances,
    years: years,
  });
};

