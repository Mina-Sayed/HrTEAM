import { ObjectId } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  image: string;
  comments: Array<{ text: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema<IPost>(
  {
    title: {
      type: String,
      // required: true,
    },
    content: {
      type: String,
      // required: true,
      minlength: 5,
    },
    image: {
      type: String,
    },
    comments: [
      {
        text: {
          type: String,
          // required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
