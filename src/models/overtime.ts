import mongoose, { ObjectId, Schema } from "mongoose";


export interface IOvertime
{
    start: Date
    end: Date
    users: [ ObjectId ],
    attendances: [ ObjectId ],
    shift: ObjectId
}

const OvertimeSchema = new Schema<IOvertime>({
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    users: [ {
        type: mongoose.Types.ObjectId,
        ref: "User",
    } ],
    attendances: [ {
        type: mongoose.Types.ObjectId,
        ref: "Attendance",
    } ],
    shift: {
        type: mongoose.Types.ObjectId,
        ref: "shift",
        required: true,
    },

});
export const Overtime = mongoose.model<IOvertime>("Overtime", OvertimeSchema);

