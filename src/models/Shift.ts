import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { days, TypeShift } from "../types/enums";
/**
 * V2
 * const day = new Schema({
    start_hour: Number,
    end_hour: Number,
})
const weeks = new Schema({
    start_day: Number,
    end_day: Number,
    days: { day }
})
const months = new Schema({
    start_month: Number,
    end_month: Number,
    weeks: { weeks }
})
const years = new Schema({
    start_year: Number,
    end_year: Number,
    months: { months }
})
interface Iday {
    start_hour: Number,
    end_hour: Number,
}
interface Iweeks {
    start_week: Number,
    end_week: Number,
    days: Iday
}
interface Imonths {
    start_month: Number,
    end_month: Number,
    weeks: Iweeks
}
interface Iyears {
    start_year: Number,
    end_year: Number,
    months: Imonths
}
export interface IShift {
    day?: Iday,
    weeks?: Iweeks,
    months?: Imonths,
    years?: Iyears,
    name: String,
    typeShift: String
}
const schema = new Schema<IShift>({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    typeShift: {
        type: String,
        enum: TypeShift,
    },
    day: { day },
    weeks: { weeks },
    months: { months },
    years: { years }
}, { timestamps: true })
export const Company = mongoose.model('shift', schema);
 **/
export interface IShift {
    start_day: number,
    end_day: number,
    time: {
        start_hour: number,
        start_mins: number,
        end_hour: number,
        end_mins: number,
        originalTime:{
            hours:Number,
            mins:Number
        }

    },
    weeklyHolidays: [number],
    name: String,
    branch: ObjectId,
    originalTime: Number
    origianalDays: [Number],
    allows: {
        weeklyHolidays: [Number],
        lateTime: {
            hours: Number,
            mins: Number,
        },
        leavingTime: {
            hours: Number,
            mins: Number,
        },
        overTime:{
            hour:Number,
            mins:Number
        }

    },
    clicked:Number
}
const schema = new Schema<IShift>({
    start_day: Number,
    end_day: Number,
    time: {
        start_hour: Number,
        end_hour: Number,
        start_mins: {
            type:Number,
            default:0
        },
        end_mins: {
            type:Number,
            default:0
        },
        originalTime: {
            hours:Number,
            mins:{
                type:Number,
                default:0
            },
        }
    },
    origianalDays: [Number],
    name: String,
    branch: {
        type: ObjectId,
        ref: "Branches",
    },
    allows: {
        weeklyHolidays: [Number],
        lateTime: {
            hours: {
                type:Number,
                default:0
            },
            mins: {
                type:Number,
                default:0
            },
        },
        leavingTime: {
            hours:{
                type:Number,
                default:0
            },
            mins: {
                type:Number,
                default:0
            },
        },
        overTime:{
            hour:{
                type:Number,
                default:0
            },
            mins:{
                type:Number,
                default:0
            },
        }

    },
    clicked:{
        type:Number,
        default:0
    }
})
schema.pre('save', async function (next) {
    if (!this.isNew) return next();
    this.time.originalTime.hours = (this.time.end_hour - this.time.start_hour)
    this.time.originalTime.mins = (this.time.end_mins - this.time.start_mins)
    const weeklyHolidays: any = []  
    const origianalDays: any = []
    for (let index = this.end_day; index >= this.start_day; index--) {
        origianalDays.push(index)
    }
    for (let index = 0; index < days.length; index++) {
        const day = days[index]
        if (!origianalDays.includes(day)) {
            weeklyHolidays.push(day)
        }
    }
    this.allows.weeklyHolidays = weeklyHolidays
    this.origianalDays = origianalDays
    next();
});

export const Shift = mongoose.model('shift', schema);