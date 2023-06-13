import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";


export interface IPayroll
{
    employee: mongoose.Schema.Types.ObjectId;
    day: Date;
    originalTime: Number;
    lateTime: Number;
    dailySalary: Number;
    type: Enumerator;
    salary: Number;
    calculateDailySalary: (
        originalTime: Number,
        lateTime: Number,
        salary: Number,
    ) => Number;
    shift: ObjectId;
    branch: ObjectId;
    department: ObjectId;
}

const payrollSchema = new Schema<IPayroll>(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        day: {
            type: Date,
            required: true,
        },
        dailySalary: {
            type: Number,
            required: true,
        },
        originalTime: {
            type: Number,
            required: true,
        },
        lateTime: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: [ "shift", "overtime" ],
        },
        salary: {
            type: Number,
            required: true,
        },
        shift: {
            type: ObjectId,
            ref: "shift",
        },
        branch: {
            type: ObjectId,
            ref: "branches",
        },
        department: {
            type: ObjectId,
            ref: "departments",
        },
    },
    { timestamps: true },
);

const Payroll = mongoose.model<IPayroll>("Payroll",
    payrollSchema);

payrollSchema.methods.calculateDailySalary = (
    originalTime: number,
    lateTime: number,
    salary: number,
) =>
{
    return Number(salary / (originalTime - lateTime));
};
export default Payroll;
