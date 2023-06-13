import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
    title: string;
    content: string;
    image: string;
    creator: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ServicesSchema = new Schema<IService>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
    },
    image: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

export default mongoose.model<IService>("Services", ServicesSchema);
