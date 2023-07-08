import mongoose, { ObjectId, Schema } from "mongoose";
export interface IoverTime {
    start: Date
    end: Date
    users: [ObjectId],
    attendences: [ObjectId],
    shift: ObjectId
}
const OvertimeSchema = new Schema<IoverTime>({
    start: {
        type: Date, required: true
    },
    end: {
        type: Date, required: true
    },
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    attendences: [{ type: mongoose.Types.ObjectId, ref: 'Attendence' }],
    shift: {
        type: mongoose.Types.ObjectId, ref: "shift", required: true
    }

});
export const Overtime = mongoose.model<IoverTime>('Overtime', OvertimeSchema);

