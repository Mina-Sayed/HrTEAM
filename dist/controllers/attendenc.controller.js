"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCountForEveryYear = exports.getAllAttendforEmployee = exports.getAllAttendforUsers = exports.getStatusAttendToday = exports.attend = void 0;
const attendenc_model_1 = require("./../models/attendenc.model");
const Shift_1 = require("./../models/Shift");
const OverTime_1 = require("./../models/OverTime");
const Break_1 = require("./../models/Break");
const Branch_1 = require("./../models/Branch");
const User_1 = __importDefault(require("../models/User"));
const distance_helper_1 = require("../helpers/distance.helper");
const time_helper_1 = require("../helpers/time.helper");
const payrol_1 = __importDefault(require("../models/payrol"));
const Contract_1 = __importDefault(require("../models/Contract"));
const enums_1 = require("../types/enums");
const startToday = new Date(new Date().setHours(2, 0));
const endToday = new Date(new Date().setHours(25, 59));
const attend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const MIN_ACCURACY = 0.1; // km
    // get user with the branch and shift [User]
    //........................................#
    const TimeNow = new Date(Date.now());
    const dateNow = new Date(new Date(TimeNow).setHours(TimeNow.getHours() + 1, TimeNow.getMinutes())); // date for now
    console.log(dateNow, 'TimeNow');
    const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (!user || !user.branch)
        return res
            .status(404)
            .send({ error_en: 'The user with any branch was not found' });
    //get branch and chake the user in the shift work
    const branch = yield Branch_1.Branch.findOne({
        _id: user.branch,
        shift: user.shift,
    });
    if (!branch)
        return res
            .status(404)
            .send({ error_en: 'The branch with the given user shift was not found' });
    // get Break
    const breaks = yield Break_1.Break.find({
        users: { $elemMatch: { $eq: user._id } },
    });
    //get overTime
    const overtimes = yield OverTime_1.Overtime.find({
        users: { $elemMatch: { $eq: user._id } },
        start: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
        },
    });
    console.log(new Date(endToday).getDay());
    //get shift with the brnach
    let shift = yield Shift_1.Shift.findOne({
        branch: user.branch,
        _id: user.shift,
        origianalDays: { $in: dateNow.getDay() },
    });
    // if the time shift not mache time now and the user dose not have any overtime for the day
    if (!shift && !overtimes[0])
        return res.status(200).send({
            message_en: "you don't have any shift for now and also don't have any overtime , maybe the day is holiday",
        });
    // Check for attendence location
    const { lat, long, radius } = req.body;
    const branchLat = branch.location.lat;
    const branchLong = branch.location.long;
    console.log(long, "long");
    console.log(lat, "lat");
    const distance = (0, distance_helper_1.getDistance)(lat, long, branchLat, branchLong);
    if (distance > MIN_ACCURACY)
        return res
            .status(400)
            .send("your location doesn't match the branch location. Please, make sure you use your phone");
    //get user with attandence to chake
    let userAttend;
    //........................................*
    // get the data the attendance need to created
    //............................................................#
    //...............................................................#
    // must  user location match branch location to accept sign [Shift]
    // soon will be valid *
    //...............................................................*
    let dateStartShift;
    let chakeDay;
    let timeSignOuSgift;
    let timeToStartShift;
    let dateEndtShift;
    // originTime for user shift
    let originTim;
    // must have a shift to a assign those properties
    if (shift) {
        dateStartShift = new Date(new Date().setHours(shift.time.start_hour, shift.time.start_mins && shift.time.start_mins)); // >>> the time signin must be == time now or smaller time now
        dateEndtShift = new Date(new Date().setHours(shift.time.end_hour - 1, shift.time.end_mins && shift.time.end_mins));
        console.log(dateStartShift, 'dateStartShift');
        console.log(dateNow, 'dateNow');
        // >>> the time signin must be == time now or smaller time now
        userAttend = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        });
        console.log(userAttend, "userAttend");
        chakeDay = shift.origianalDays.includes(dateNow.getDay()); // chake days
        // const addMinutesDateNow = addMinutes(dateNow, 30) // >>> after add 30 munites to time now
        originTim = shift.time.originalTime;
        // collect the time left for  sing out from shift
        timeSignOuSgift = (0, time_helper_1.getDateWithMuAnHAndS)(dateEndtShift, dateNow);
        timeToStartShift = (0, time_helper_1.getDateWithMuAnHAndS)(dateStartShift, dateNow);
    }
    // time late
    // for break && siginoute of all
    let TimeBreak;
    let userBreak;
    let userBreakEnd;
    let TimeOverTime;
    // to know the near time for (TimeBreak , TimeSignOuteBreak )
    if (chakeDay) {
        let getBreak = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            shift: shift._id,
            createdAt: {
                $gte: new Date(dateStartShift).toISOString(),
                $lt: new Date(dateEndtShift).toISOString(),
            },
        });
        console.log(breaks);
        if (!breaks[0]) {
            TimeBreak = {
                left: true,
            };
        }
        breaks.map((br) => {
            //................#
            // to get time left for break and return the near Signin
            console.log(br);
            const startDate = new Date(new Date().setHours(br.start.hours, br.start.mins));
            const endDate = new Date(new Date().setHours(br.end.hours, br.end.mins));
            const timeLeftBreak = (0, time_helper_1.getDateWithMuAnHAndS)(startDate, dateNow);
            // to get time left for SignOut
            const timeLeftSignO = (0, time_helper_1.getDateWithMuAnHAndS)(endDate, dateNow);
            // just if time left to sgin and sign out and the break is not open
            if (timeLeftBreak.hours == 0 &&
                timeLeftBreak.minutes <= 59 &&
                (timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0) &&
                !br.isOpen) {
                return (TimeBreak = {
                    timeBreakStart: startDate,
                    timeBreakEnd: endDate,
                    timeLeft: timeLeftBreak.minutes,
                    signOute: timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
                        ? { hours: timeLeftSignO.hours, muin: timeLeftSignO.minutes }
                        : 0,
                    isComplated: timeLeftSignO.minutes == 0 && timeLeftSignO.hours == 0
                        ? true
                        : false,
                    left: timeLeftSignO.left ? true : false,
                });
            }
            // if the break is open must the user get out in any time for break
            else if (br.isOpen && userAttend) {
                console.log('yabaaa');
                let endTime;
                // to add the time for break
                const hourswithMins = br.duration.hours * 60 + br.duration.mins;
                //know first hour for break open
                const firtsMins = Math.abs(new Date(Date.now()).getMinutes() - shift.time.start_mins);
                const firstHour = (0, time_helper_1.getDateWithMuAnHAndS)(new Date(new Date().setHours(shift.time.start_hour + 1, shift.time.start_mins)), dateNow);
                //know the last hour of shift
                const lastMins = Math.abs(shift.time.end_mins - new Date(Date.now()).getMinutes());
                const lastHour = (0, time_helper_1.getDateWithMuAnHAndS)(new Date(new Date().setHours(shift.time.end_hour - 1, shift.time.end_mins)), dateNow);
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
                if (getBreak &&
                    !getBreak.break[0] &&
                    (lastHour.left || firstHour.left)) {
                    endTime = (0, time_helper_1.addMinutes)(dateNow, hourswithMins);
                    const timeLeftSignO = (0, time_helper_1.getDateWithMuAnHAndS)(endTime, dateNow);
                    return (TimeBreak = {
                        timeBreakStart: dateNow,
                        timeBreakEnd: endTime,
                        timeLeft: 0,
                        signOute: timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
                            ? { hours: timeLeftSignO.hours, muin: timeLeftSignO.minutes }
                            : 0,
                        isComplated: false,
                        left: false,
                    });
                }
                // if the user already signin for break
                else if (getBreak && getBreak.break[0]) {
                    endTime = (0, time_helper_1.addMinutes)(getBreak.break[0].start, hourswithMins);
                    const timeLeftSignO = (0, time_helper_1.getDateWithMuAnHAndS)(endTime, dateNow);
                    return (TimeBreak = {
                        timeBreakStart: getBreak.break[0].start,
                        timeBreakEnd: endTime,
                        timeLeft: 0,
                        signOute: timeLeftSignO.hours >= 0 || timeLeftSignO.minutes >= 0
                            ? { hours: timeLeftSignO.hours, muin: timeLeftSignO.minutes }
                            : 0,
                        isComplated: timeLeftSignO.minutes == 0 && timeLeftSignO.hours == 0
                            ? true
                            : false,
                        left: timeLeftSignO.left ? true : false,
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
    // if user have a brek
    console.log(TimeBreak, 'aaaaaaaaaaaaaaa.....');
    if (TimeBreak && (!(TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.left) || TimeBreak.isComplated)) {
        // if (TimeBreak?.timeBreakStart && TimeBreak?.timeBreakEnd) {
        // get break  if user do signin for break
        console.log(TimeBreak);
        const dateStart = new Date(new Date(TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeBreakStart).setHours(new Date(TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeBreakStart).getHours(), 5));
        const dateEnd = new Date(TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeBreakEnd).toISOString();
        console.log('this frist hell ');
        console.log(dateStart);
        console.log(dateEnd);
        userBreak = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            shift: shift._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        }, {
            break: {
                $elemMatch: {
                    start: {
                        $gte: dateStart,
                        $lte: dateEnd,
                    },
                },
            },
        });
        console.log(userBreak, 'userBreak');
        console.log('this second hell ');
        // get break if user do sign out for break
        userBreakEnd = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            shift: shift._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        }, {
            break: {
                $elemMatch: {
                    start: {
                        $gte: dateStart,
                        $lt: dateEnd,
                    },
                    status: true,
                },
            },
        });
        console.log(userBreakEnd, 'sadsad');
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
        const userAtt = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        }, {
            overTime: {
                $elemMatch: {
                    signIn: { $lte: new Date(Date.now()) },
                },
            },
        });
        console.log(userAtt, 'userAaa');
        overtimes.map((overTime) => {
            var _a, _b;
            const StartOverTime = new Date(overTime.start); // >>> the time signin must be == time now or smaller time now
            const chakeDay = StartOverTime.getDay() === dateNow.getDay(); // chake days
            const chakeMonth = StartOverTime.getMonth() === dateNow.getMonth(); // chake months
            if (chakeDay && chakeMonth) {
                const timeLeftOverTime = (0, time_helper_1.getDateWithMuAnHAndS)(overTime.start, dateNow);
                // to get time left for SignOut
                const timeLeftSignO = (0, time_helper_1.getDateWithMuAnHAndS)(overTime.end, dateNow);
                if ((timeLeftOverTime === null || timeLeftOverTime === void 0 ? void 0 : timeLeftOverTime.hours) == 0 &&
                    (timeLeftOverTime === null || timeLeftOverTime === void 0 ? void 0 : timeLeftOverTime.minutes) <= 59 &&
                    ((timeLeftSignO === null || timeLeftSignO === void 0 ? void 0 : timeLeftSignO.hours) >= 0 || (timeLeftSignO === null || timeLeftSignO === void 0 ? void 0 : timeLeftSignO.minutes) >= 0)) {
                    // if found overtime return the time left
                    if ((timeLeftOverTime === null || timeLeftOverTime === void 0 ? void 0 : timeLeftOverTime.minutes) != 0) {
                        return (TimeOverTime = {
                            timeOverStart: overTime.start,
                            timeOverEnd: overTime.end,
                            timeLeft: timeLeftOverTime.minutes,
                        });
                    }
                    else if ((timeLeftOverTime === null || timeLeftOverTime === void 0 ? void 0 : timeLeftOverTime.minutes) <= 0 &&
                        !(userAtt === null || userAtt === void 0 ? void 0 : userAtt.overTime) &&
                        ((timeLeftSignO === null || timeLeftSignO === void 0 ? void 0 : timeLeftSignO.hours) > 0 || (timeLeftSignO === null || timeLeftSignO === void 0 ? void 0 : timeLeftSignO.minutes) > 0)) {
                        return (TimeOverTime = {
                            timeOverStart: overTime.start,
                            timeOverEnd: overTime.end,
                            timeLeft: 0,
                            _id: overTime._id,
                        });
                    }
                    // if the time left is done
                    else if ((timeLeftOverTime === null || timeLeftOverTime === void 0 ? void 0 : timeLeftOverTime.minutes) == 0 &&
                        userAtt &&
                        (userAtt === null || userAtt === void 0 ? void 0 : userAtt.overTime) &&
                        !((_a = userAtt === null || userAtt === void 0 ? void 0 : userAtt.overTime[0]) === null || _a === void 0 ? void 0 : _a.isCompleted)) {
                        return (TimeOverTime = {
                            timeOverStart: overTime === null || overTime === void 0 ? void 0 : overTime.start,
                            timeOverEnd: overTime === null || overTime === void 0 ? void 0 : overTime.end,
                            timeLeft: 0,
                            signOute: {
                                hours: timeLeftSignO.hours,
                                mins: timeLeftSignO.minutes,
                            },
                            _id: overTime._id,
                        });
                    }
                    // if time for sgin out is done
                    else if ((userAtt === null || userAtt === void 0 ? void 0 : userAtt.overTime) && ((_b = userAtt === null || userAtt === void 0 ? void 0 : userAtt.overTime[0]) === null || _b === void 0 ? void 0 : _b.isCompleted)) {
                        return (TimeOverTime = undefined);
                    }
                }
                else {
                    return (TimeOverTime = false);
                }
            }
        });
    }
    // chakes for sginIn and sginOut (Breaks)
    const SginInOuteBreak = chakeDay && TimeBreak && userAttend && !TimeBreak.left;
    // if time break time is not near so user try to sign in twice at the same  day
    console.log(timeToStartShift, 'dsadsdsadsdsdsadsadsadsadsadsadsa');
    if (chakeDay &&
        (!TimeBreak || (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.left)) &&
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.hours) >= 1 &&
        userAttend &&
        ((userBreakEnd === null || userBreakEnd === void 0 ? void 0 : userBreakEnd.break[0]) || !(userBreak === null || userBreak === void 0 ? void 0 : userBreak.break[0]))) {
        return res
            .status(400)
            .send({ error_en: `you already sign in for your shift for today ${new Date(Date.now())}` });
    }
    // if someone to sign in for break and the  break time in branch does not match the user time
    else if (SginInOuteBreak &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeLeft) <= 59 &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeLeft) != 0 &&
        !(userBreak === null || userBreak === void 0 ? void 0 : userBreak.break[0])) {
        return res.status(400).send({
            error_en: ` sigin for break , time left for break is  ${TimeBreak.timeLeft}  `,
        });
    }
    //if someone to sigoute must the  user time match the branch time (Break)
    else if (SginInOuteBreak &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeLeft) == 0 &&
        ((_b = TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.signOute) === null || _b === void 0 ? void 0 : _b.hours) <= 1 &&
        ((_c = TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.signOute) === null || _c === void 0 ? void 0 : _c.muin) != 0 &&
        (userBreak === null || userBreak === void 0 ? void 0 : userBreak.break[0])) {
        return res.status(400).send({
            error_en: ` to sign out from your break the time left for sign out for break is ${TimeBreak.signOute.hours} : ${TimeBreak.signOute.muin} `,
        });
    }
    else if (SginInOuteBreak &&
        (userBreak === null || userBreak === void 0 ? void 0 : userBreak.break[0]) &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeLeft) == 0 &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.timeBreakStart) &&
        (((_d = TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.signOute) === null || _d === void 0 ? void 0 : _d.hours) >= 1 || ((_e = TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.signOute) === null || _e === void 0 ? void 0 : _e.muin) >= 0)) {
        return res.status(400).send({
            error_en: `you already sgin in for break `,
        });
    }
    //if someone to sigoute must the  user time match the branch time for (Shift)
    // console.log(timeSignOuSgift.hours <= 1);
    else if (chakeDay &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.left) &&
        userAttend &&
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.minutes) > 0 &&
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.hours) == 0 &&
        !timeSignOuSgift.left &&
        (userBreak[0] ? userBreakEnd === null || userBreakEnd === void 0 ? void 0 : userBreakEnd.break[0] : true)) {
        console.log('why did that');
        const timeLeft = (0, time_helper_1.getDateWithMuAnHAndS)(dateEndtShift, dateNow);
        return res.status(400).send({
            error_en: `the time left for sign out from shift is ${timeLeft.hours}:${timeLeft.minutes}`,
        });
    }
    // if someone try to sign out twice at the same  day
    else if (timeSignOuSgift && // new updates 2
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.hours) == 0 &&
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.minutes) == 0 &&
        chakeDay &&
        userAttend &&
        (userAttend === null || userAttend === void 0 ? void 0 : userAttend.isCompleted) &&
        !TimeOverTime
    // TimeBreak.isComplated
    ) {
        res
            .status(400)
            .send({
            error_en: `You already sign out for tody `,
        });
    }
    //if the user have over time but the over time is not near to his time and also dose not have a shift for his today
    // && !TimeBreak 
    else if (!TimeOverTime && (timeToStartShift === null || timeToStartShift === void 0 ? void 0 : timeToStartShift.hours) >= 1) {
        return res.send({ message_en: `You don't have any thing for now` });
    }
    // if user have a overtime
    else if (TimeOverTime) {
        //if the time left is not done for overTime start
        if (TimeOverTime.timeLeft) {
            return res.send({
                error_en: `The time left for overtime is : ${TimeOverTime.timeLeft} Mintes`,
            });
        }
        //if the time left is not done for overTime sign out
        else if (TimeOverTime &&
            TimeOverTime.signOute &&
            (TimeOverTime.signOute.hours != 0 || TimeOverTime.signOute.mins != 0)) {
            return res.status(400).send({
                error_en: `The time left for sgin out from overtime is : ${TimeOverTime.signOute.hours}:${TimeOverTime.signOute.mins} `,
            });
        }
    }
    // I : must sign time match the branch time to accept the signIn( the time branch + half hour) [Shift , Break , overTime]]
    // II : should location user match the branch location to accept the signIn [Shift , Break , overTime] => soon
    if (chakeDay && !userAttend && !TimeOverTime && (timeToStartShift === null || timeToStartShift === void 0 ? void 0 : timeToStartShift.hours) < 1) {
        const timalate = (0, time_helper_1.timeLate)(dateStartShift, dateNow);
        const earlyTime = (0, time_helper_1.originalTime)(dateStartShift, dateNow);
        const attendanceFind = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            createdAt: { $gte: startToday, $lt: endToday },
        });
        if (attendanceFind) {
            yield attendenc_model_1.Attendance.updateOne({ member: user._id, createdAt: { $gte: startToday, $lt: endToday } }, {
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
            });
        }
        else {
            const attendance = new attendenc_model_1.Attendance({
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
            attendance.save();
        }
        if (timalate.left) {
            return res.status(200).send({
                message_en: `you sucsses for signin for the day and you are late ${timalate.hours}:${timalate.minutes}  `,
                data: shift,
            });
        }
        else if (earlyTime.hours !== 0 || earlyTime.minutes !== 0) {
            return res.status(200).send({
                message_en: `you sucsses for signin for the day and you are not late and you are eraly ${earlyTime.hours}:${earlyTime.minutes}  `,
                data: shift,
            });
        }
        else {
            return res.status(200).send({
                message_en: `you sucsses for signin for the day and you are not late `,
                data: shift,
            });
        }
    }
    // chake time break and do (signin) for user if mach
    if (SginInOuteBreak && !(userBreak === null || userBreak === void 0 ? void 0 : userBreak.break[0])) {
        // const originalTime = new Date(TimeBreak.timeBreakEnd.getHours()) - new Date(TimeBreak.timeBreakStart.getHours())
        const originalT = (0, time_helper_1.originalTime)(TimeBreak.timeBreakEnd, TimeBreak.timeBreakStart);
        yield attendenc_model_1.Attendance.updateOne({
            member: user._id,
            shift: shift._id,
            createdAt: {
                $gte: new Date(dateStartShift).toISOString(),
                $lt: new Date(dateEndtShift).toISOString(),
            },
        }, {
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
        });
        res.status(200).send({ message_en: 'You sucsses for sign in for break' });
    }
    console.log(TimeBreak, 'Time Breakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    // chake time break and do (signout) for user if mach
    if (chakeDay &&
        TimeBreak &&
        userAttend &&
        (TimeBreak === null || TimeBreak === void 0 ? void 0 : TimeBreak.isComplated) &&
        userBreak &&
        (userBreak === null || userBreak === void 0 ? void 0 : userBreak.break) &&
        (userBreak === null || userBreak === void 0 ? void 0 : userBreak.break[0]) &&
        !(userBreakEnd === null || userBreakEnd === void 0 ? void 0 : userBreakEnd.break[0])) {
        // const breakStartWithMinutesAndHours = (TimeBreak.timeBreakEnd.getHours() - 2) * 60 + (TimeBreak.timeBreakEnd.getMinutes())
        const timalate = (0, time_helper_1.timeLate)(TimeBreak.timeBreakEnd, dateNow);
        yield attendenc_model_1.Attendance.updateOne({
            member: user._id,
            shift: shift._id,
            createdAt: {
                $gte: new Date(dateStartShift).toISOString(),
                $lt: new Date(dateEndtShift).toISOString(),
            },
            'break._id': userBreak.break[0]._id,
        }, {
            $set: {
                'break.$.end': TimeBreak.timeBreakEnd,
                'break.$.signOut': dateNow,
                'break.$.status': true,
                'break.$.lateHours': {
                    hours: timalate.hours,
                    mins: timalate.minutes,
                },
            },
        });
        if (timalate.hours > 0 || timalate.minutes > 0) {
            res.status(200).send({
                message_en: `You sucsses for sign out from break and you are late ${timalate.hours}:${timalate.minutes}`,
            });
        }
        else {
            res.status(200).send({
                message_en: `You sucsses for sign out from break and you are not late`,
            });
        }
    }
    // chake time shift and do (sginOut) for user if mach
    if (shift &&
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.hours) == 0 &&
        (timeSignOuSgift === null || timeSignOuSgift === void 0 ? void 0 : timeSignOuSgift.minutes) == 0 &&
        chakeDay &&
        userAttend &&
        !(userAttend === null || userAttend === void 0 ? void 0 : userAttend.isCompleted)) {
        //time late for break
        let breakTime = {
            hours: 0,
            mins: 0,
        };
        for (let index = 0; index < userAttend.break.length; index++) {
            const element = userAttend.break[index];
            if (element.lateHours.hours) {
                breakTime.hours += element.lateHours.hours;
                breakTime.mins += element.lateHours.mins;
            }
        }
        // overAllTime
        const originalTime = (0, time_helper_1.timeLate)(userAttend.signIn, dateNow);
        const overAllHours = originalTime.hours - breakTime.hours;
        const overAllMins = Math.abs(originalTime.minutes - breakTime.mins);
        const contract = yield Contract_1.default.findOne({
            employee: user._id,
        });
        const findPayrol = yield payrol_1.default.findOne({
            employee: user._id,
            type: 'shift',
            day: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        });
        const lateTime = (breakTime.hours + userAttend.lateHours.hours) * 60 +
            (userAttend.lateHours.mins + breakTime.mins);
        const TimeShift = userAttend.originalTime.hours * 60 + userAttend.originalTime.mins;
        // const hoursWithMins =
        //   userAttend.lateHours.hours * 60 + userAttend.lateHours.mins >=
        //   userAttend.originalTime.hours * 60 + userAttend.originalTime.mins
        if (TimeShift >= lateTime) {
            yield attendenc_model_1.Attendance.updateOne({
                member: user._id,
                shift: shift._id,
                createdAt: {
                    $gte: new Date(startToday).toISOString(),
                    $lt: new Date(endToday).toISOString(),
                },
            }, {
                $set: {
                    workingHours: {
                        hours: overAllHours,
                        mins: overAllMins,
                    },
                    isCompleted: true,
                    signOut: dateNow,
                },
            });
            // payrol
            const salryHours = contract &&
                contract.dailySalary /
                    (shift.time.originalTime.hours * 60 + shift.time.originalTime.mins) /
                    60;
            const finalSalry = contract && salryHours * overAllHours + salryHours * overAllMins;
            const payrol = new payrol_1.default({
                type: 'shift',
                employee: user._id,
                day: dateNow,
                dailySalary: contract ? contract.dailySalary : 0,
                originalTime: shift.time.originalTime.hours + '.' + shift.time.originalTime.mins,
                lateTime: userAttend.lateHours.hours + '.' + userAttend.lateHours.mins,
                salary: contract ? finalSalry : 0,
                shift: shift._id,
                branch: user.branch,
                department: user.department,
            });
            !findPayrol && payrol.save();
            res.send({
                message_en: `You sucsses for sign out from shift and you working tody just ${overAllHours} : ${overAllMins}`,
            });
        }
        else {
            yield attendenc_model_1.Attendance.updateOne({
                member: user._id,
                shift: shift._id,
                createdAt: {
                    $gte: new Date(startToday).toISOString(),
                    $lt: new Date(endToday).toISOString(),
                },
            }, {
                $set: {
                    workingHours: {
                        hours: 0,
                        mins: 0,
                    },
                    signOut: dateNow,
                    isCompleted: true,
                },
            });
            // payrol
            const payrol = new payrol_1.default({
                type: 'shift',
                employee: user._id,
                day: dateNow,
                dailySalary: contract ? contract.dailySalary : 0,
                originalTime: shift.time.originalTime.hours + '.' + shift.time.originalTime.mins,
                lateTime: userAttend.lateHours.hours + '.' + userAttend.lateHours.mins,
                salary: 0,
                shift: shift._id,
                branch: user.branch,
                department: user.department,
            });
            res.send({
                message_en: `You success for sign out from shift and your time today is not allowed `,
            });
            !findPayrol && payrol.save();
        }
        // const payrol = new Payrol({
        //   employee: user._id,
        //   type: 'shift',
        //   day: new Date(Date.now()).getDay(),
        // })
    }
    //chake for overTime to singin and sgin out
    if (TimeOverTime && (TimeOverTime === null || TimeOverTime === void 0 ? void 0 : TimeOverTime.timeLeft) === 0) {
        const originTim = (0, time_helper_1.originalTime)(TimeOverTime.timeOverEnd, TimeOverTime.timeOverStart);
        const timalate = (0, time_helper_1.timeLate)(TimeOverTime.timeOverStart, dateNow);
        const userAtt = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            shift: TimeOverTime._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
            overTime: { $elemMatch: { signIn: { $lte: new Date(Date.now()) } } },
        });
        let shiftUser = yield Shift_1.Shift.findOne({
            branch: user.branch,
            _id: user.shift,
        });
        const userAttendedOver = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        }, {
            overTime: {
                $elemMatch: {
                    overId: TimeOverTime._id,
                },
            },
        });
        const shiftAttend = yield attendenc_model_1.Attendance.findOne({
            member: user._id,
            shift: user.shift,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        });
        // if dose not exist ceate new shift
        if (!userAtt && !shiftAttend && !(userAttendedOver === null || userAttendedOver === void 0 ? void 0 : userAttendedOver.overTime[0])) {
            const attend = new attendenc_model_1.Attendance({
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
            });
            attend.save();
            yield OverTime_1.Overtime.updateOne({ _id: TimeOverTime._id }, {
                $push: {
                    attendences: attend._id,
                },
            });
            if ((timalate === null || timalate === void 0 ? void 0 : timalate.hours) == 0 && (timalate === null || timalate === void 0 ? void 0 : timalate.minutes) === 0) {
                return res.send({ message_en: `you succes sginIn for overTime` });
            }
            else {
                return res.send({
                    message_en: `you succes sginIn for overTime and you are late ${timalate.hours}:${timalate.minutes}`,
                });
            }
        }
        // if exiest shift push overTime
        else if (!userAtt && shiftAttend && !(userAttendedOver === null || userAttendedOver === void 0 ? void 0 : userAttendedOver.overTime[0])) {
            yield attendenc_model_1.Attendance.updateOne({
                shift: user.shift,
                member: user._id,
                createdAt: {
                    $gte: new Date(startToday).toISOString(),
                    $lt: new Date(endToday).toISOString(),
                },
            }, {
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
            });
            yield OverTime_1.Overtime.updateOne({ _id: TimeOverTime._id }, {
                $push: {
                    attendences: shiftAttend._id,
                },
            });
            if (timalate.hours == 0 && timalate.minutes === 0) {
                return res.send({ message_en: `you succes sginIn for overTime` });
            }
            else {
                return res.send({
                    message_en: `you succes sginIn for overTime and you are late ${timalate.hours}:${timalate.minutes}`,
                });
            }
        }
        //for sgin out form overTime
        else if ((userAttendedOver === null || userAttendedOver === void 0 ? void 0 : userAttendedOver.overTime[0]) &&
            !((_f = userAttendedOver === null || userAttendedOver === void 0 ? void 0 : userAttendedOver.overTime[0]) === null || _f === void 0 ? void 0 : _f.isCompleted) &&
            TimeOverTime &&
            (TimeOverTime === null || TimeOverTime === void 0 ? void 0 : TimeOverTime.signOute) &&
            (TimeOverTime === null || TimeOverTime === void 0 ? void 0 : TimeOverTime.signOute.hours) == 0 &&
            (TimeOverTime === null || TimeOverTime === void 0 ? void 0 : TimeOverTime.signOute.mins) == 0) {
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
            const timeWorking = (0, time_helper_1.originalTime)(dateNow, userAttendedOver.overTime[0].signIn);
            yield attendenc_model_1.Attendance.updateOne({
                member: user._id,
                createdAt: {
                    $gte: new Date(startToday).toISOString(),
                    $lt: new Date(endToday).toISOString(),
                },
                'overTime._id': userAttendedOver.overTime[0]._id,
            }, {
                $set: {
                    isCompleted: true,
                    'overTime.$.signOut': dateNow,
                    'overTime.$.isCompleted': true,
                    'overTime.$.workingHours': {
                        hours: timeWorking.hours,
                        mins: timeWorking.minutes,
                    },
                },
            });
            const contract = yield Contract_1.default.findOne({
                employee: user._id,
                endDate: { $gte: new Date(Date.now()) },
            });
            const lateTime = userAttendedOver.overTime[0].lateHours;
            const salryHours = contract &&
                (contract.dailySalary /
                    (((_g = shiftUser === null || shiftUser === void 0 ? void 0 : shiftUser.time) === null || _g === void 0 ? void 0 : _g.originalTime.hours) * 60 +
                        shiftUser.time.originalTime.mins)) *
                    60;
            const finalSalry = contract &&
                salryHours * timeWorking.hours + (salryHours / 60) * timeWorking.minutes;
            // const findPayrol = await Payrol.findOne({
            //   employee: user._id,
            //   type: 'overtime',
            //   day: {
            //     $gte: new Date(startToday).toISOString(),
            //     $lt: new Date(endToday).toISOString(),
            //   },
            // })
            const payrol = new payrol_1.default({
                type: 'overtime',
                employee: user._id,
                day: dateNow,
                dailySalary: contract ? contract.dailySalary : 0,
                originalTime: shiftUser.time.originalTime.hours +
                    '.' +
                    shiftUser.time.originalTime.mins,
                lateTime: lateTime.hours + '.' + lateTime.mins,
                salary: contract ? finalSalry : 0,
                shift: shiftUser._id,
                branch: user.branch,
                department: user.department,
            });
            payrol.save();
            return res.send({ message_en: `you succes sgin out from overTime` });
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
});
exports.attend = attend;
const getStatusAttendToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const attend = yield attendenc_model_1.Attendance.findOne({
        member: user._id,
        shift: user.shift,
        createdAt: {
            $gte: new Date(startToday).toISOString(),
            $lt: new Date(endToday).toISOString(),
        },
    });
    if (!attend)
        return res.status(200).send({
            message_en: "Maybe you do not signIn for today or you don't have shift for today",
            message_ar: 'ربما لم تقم بتسجيل الدخول لهذا اليوم أو ليس لديك وردية اليوم',
        });
    return res.send({ attend, success: true });
});
exports.getStatusAttendToday = getStatusAttendToday;
const getAllAttendforUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    let attends;
    if (((_h = req.user) === null || _h === void 0 ? void 0 : _h.role) === enums_1.Roles.EMPLOYEE) {
        console.log('fuck');
        attends = yield attendenc_model_1.Attendance.find({
            member: (_j = req.user) === null || _j === void 0 ? void 0 : _j._id,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        }).populate('member');
    }
    else {
        const { branch, department, company } = req.query;
        const branches = (yield Branch_1.Branch.find({ company: company })).map((branch) => branch._id.toString());
        const filter = {
            branch: company && branches,
            department: department && department,
            createdAt: {
                $gte: new Date(startToday).toISOString(),
                $lt: new Date(endToday).toISOString(),
            },
        };
        !department && delete filter.department;
        attends = yield attendenc_model_1.Attendance.find(filter).populate('member');
    }
    if (!attends[0])
        return res
            .status(400)
            .send({ error_en: 'no attende found for an employee' });
    return res.send({
        attends,
        success: true,
    });
});
exports.getAllAttendforUsers = getAllAttendforUsers;
const getAllAttendforEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, shift } = req.user;
    const attends = yield attendenc_model_1.Attendance.find({
        member: _id,
        shift: shift,
    });
    if (!attends[0])
        return res.status(400).send({ error_en: 'no attende found yet..' });
    return res.send({
        attends,
        success: true,
    });
});
exports.getAllAttendforEmployee = getAllAttendforEmployee;
const getAllCountForEveryYear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m, _o, _p;
    let company = req.query.company;
    let attendences = [];
    if (((_k = req.user) === null || _k === void 0 ? void 0 : _k.role) === enums_1.Roles.EMPLOYEE) {
        attendences = yield attendenc_model_1.Attendance.find({ member: req.user._id });
    }
    else if (((_l = req.user) === null || _l === void 0 ? void 0 : _l.role) === enums_1.Roles.ADMIN || ((_m = req.user) === null || _m === void 0 ? void 0 : _m.role) === enums_1.Roles.ROOT) {
        ((_o = req.user) === null || _o === void 0 ? void 0 : _o.role) === enums_1.Roles.ADMIN
            ? (company = (_p = req.user) === null || _p === void 0 ? void 0 : _p.company)
            : (company = req.query.company);
        const branches = (yield Branch_1.Branch.find({ company: company })).map((branch) => branch._id.toString());
        attendences = yield attendenc_model_1.Attendance.find({ branch: branches });
    }
    let years = {};
    // get uineq years
    for (let index = 0; index < attendences.length; index++) {
        const attend = attendences[index];
        !years[new Date(attend.createdAt).getFullYear()]
            ? (years[new Date(attend.createdAt).getFullYear()] = {
                complate: 0,
                uncomplate: 0,
            })
            : years[new Date(attend.createdAt).getFullYear()];
    }
    //for get count
    for (let index = 0; index < attendences.length; index++) {
        const attend = attendences[index];
        attend.isCompleted
            ? (years[new Date(attend.createdAt).getFullYear()].complate += 1)
            : (years[new Date(attend.createdAt).getFullYear()].uncomplate += 1);
    }
    console.log(years);
    res.send({
        attendences,
        years,
    });
});
exports.getAllCountForEveryYear = getAllCountForEveryYear;
// ? years[new Date(attend.createdAt).getFullYear()]?.isComplated
// ? (years[
//     new Date(attend.createdAt).getFullYear()
//   ].isComplated += 1)
// : 0
// : years[new Date(attend.createdAt).getFullYear()].isComplated,
