import mongoose, { Schema} from "mongoose";
import { ObjectId } from "mongodb";
// const { days } = require('../data/enums');
// const { BranchShift } = require('./DayShift');
export const branchSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    location: {
        lat: Number,
        long: Number
    },
    company: {
        type: ObjectId,
        required: true,
        ref: 'Company'
    },
    fixedHolidays: [Date],
    clicked:{
        type:Number,
        default:0
    },
    emp:Array,
    deps:Array,

}, { timestamps: true });

export const Branch = mongoose.model("Branches", branchSchema);


