"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRateData = void 0;
const attendenc_model_1 = require("./../models/attendenc.model");
function getRateData(fromDate, toDate, userId) {
    console.log(userId);
    return attendenc_model_1.Attendance.aggregate([
        {
            $match: {
                createdAt: { $gte: fromDate, $lt: toDate },
                member: userId,
                isCompleted: true,
            },
        },
        {
            $facet: {
                attendenceData: [
                    {
                        $group: {
                            _id: userId,
                            attendedHours: { $sum: '$workingHours.hours' },
                            attendedMins: { $sum: '$workingHours.mins' },
                            totalHours: { $sum: '$originalTime.hours' },
                            totalMins: { $sum: '$originalTime.mins' },
                            latenessHours: { $sum: '$lateHours.hours' },
                            latenessMins: { $sum: '$lateHours.mins' },
                            attendedDays: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            attendedHours: 1,
                            attendedDays: 1,
                            attendedMins: 1,
                            attendence: 1,
                            totalHours: 1,
                            latenessHours: 1,
                            latenessMins: 1,
                            totalMins: 1,
                        },
                    },
                ],
                attendenceOverTime: [
                    {
                        $unwind: { path: '$overTime' },
                    },
                    {
                        $match: {
                            'overTime.isCompleted': true,
                        },
                    },
                    {
                        $group: {
                            _id: userId,
                            attendedHours: { $sum: '$overTime.workingHours.hours' },
                            attendedMins: { $sum: '$overTime.workingHours.mins' },
                            totalHours: { $sum: '$overTime.originalTime.hours' },
                            totalMins: { $sum: '$overTime.originalTime.mins' },
                            latenessHours: { $sum: '$overTime.lateHours.hours' },
                            latenessMins: { $sum: '$overTime.lateHours.mins' },
                            attendedOverTime: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            attendedHours: 1,
                            attendedOverTime: 1,
                            attendedMins: 1,
                            attendence: 1,
                            totalHours: 1,
                            latenessHours: 1,
                            latenessMins: 1,
                            totalMins: 1,
                        },
                    },
                ],
                BreakLatenes: [
                    {
                        $unwind: "$break",
                    },
                    {
                        $group: {
                            _id: userId,
                            latenessHours: { $sum: '$break.lateHours.hours' },
                            latenessMins: { $sum: '$break.lateHours.mins' },
                            attendedBreak: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            latenessHours: 1,
                            latenessMins: 1,
                        },
                    },
                ],
                // ],
                // totalDaysAttendence: [
                //   {
                //     $group: {
                //       _id: {
                //         $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                //       },
                //     },
                //   },
                //   {
                //     $group: {
                //       _id: null,
                //       attendenceData: {
                //         $sum: 1,
                //       },
                //     },
                //   },
                // ],
            },
        },
    ]);
}
exports.getRateData = getRateData;
