import mongoose, { ObjectId } from "mongoose";
export interface Ibreak {
    start: {
        hours: Number,
        mins: Number,
    },
    end: {
        hours: Number,
        mins: Number,
    },
    isOpen: Boolean,
    duration: {
        hours: Number,
        mins: Number,
    }
    users: [ObjectId]
    shift: ObjectId
}
const BreakSchema = new mongoose.Schema<Ibreak>({
    start: {
        hours: Number,
        mins: {
            type: Number,
            default: 0
        }
    },
    end: {
        hours: Number,
        mins: {
            type: Number,
            default: 0
        }
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    duration: {
        hours: Number,
        mins: {
            type: Number,
            default: 0
        }
    },
    shift: {
        type: mongoose.Types.ObjectId,
        ref: "shift"
    },
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

export const Break = mongoose.model<Ibreak>('Break', BreakSchema);

