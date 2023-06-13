import Joi from "joi";
import mongoose, { Schema } from "mongoose";


export interface IComment
{
  title: String,
  user: mongoose.Schema.Types.ObjectId,
  active: false,
  blog: mongoose.Schema.Types.ObjectId,
  rating: Number,
  replies: [ mongoose.Schema.Types.ObjectId ]
}

const commentSchema = new Schema<IComment>({
  title: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,

  },
  replies: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  } ],
}, { timestamps: true });


const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;

export const commentValidation = (comment: IComment, reqType: any) =>
{
  const schema = Joi.object({
    title: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.forbidden(),
    }),
    user: Joi.object().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.forbidden(),
    }),
    blog: Joi.object().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.forbidden(),
    }),
    rating: Joi.number(),
    replys: Joi.array().items(Joi.object()),
  });
  return schema.tailor(reqType).validate(comment);
};

