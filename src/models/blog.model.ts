import mongoose, { mongo, Schema } from 'mongoose'
import Joi from 'joi'
import { BlogType } from '../types/blogType'
import { Likes, LikesArr } from '../types/likes'
import { ObjectId } from 'mongodb'
interface IBlog {
  title: String
  description: String
  image: String
  comments: [mongoose.Schema.Types.ObjectId]
  likes: [{ user: mongoose.Schema.Types.ObjectId; likeType: Likes }]
  startDate: Date
  endDate: Date
  blogType: BlogType
  user: mongoose.Schema.Types.ObjectId
  // keywordDescription: String
  // keywords: [String]
  company: ObjectId
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      'https://tse4.mm.bing.net/th?id=OIP.Z5BlhFYs_ga1fZnBWkcKjQHaHz&pid=Api&P=0',
    // required:[true , 'Please add an Image for Your Blog']
  },
  // keywordDescription: { type: String },
  // keywords: [String],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: {
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likeType: {
          type: String,
          enum: LikesArr,
        },
      },
    ],
    default: [],
  },
  startDate: Date,
  endDate: Date,
  blogType: {
    type: String,
    enum: BlogType,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: {
    type: ObjectId,
    ref: "company"
  }
}, {
  timestamps: true
})

const Blog = mongoose.model<IBlog>('Blog', blogSchema)

export const blogValidation = (blog: IBlog, reqType: any) => {
  const schema = Joi.object({
    title: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.forbidden(),
    }),
    description: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.forbidden(),
    }),

    // meta: Joi.string().alter({
    //   post: (schema: any) => schema.required(),
    //   put: (schema: any) => schema.forbidden(),
    // }),
    // keywords: Joi.array().items(Joi.string()),
    // keywordDescription: Joi.string().alter({
    //   post: (schema: any) => schema.required(),
    //   put: (schema: any) => schema.forbidden(),
    // }),
    comments: Joi.array().items(Joi.object()),

    likes: Joi.array().items({
      user: Joi.object().required(),
    }),
    blogType: Joi.string().valid('event', 'blog'),

    startDate: Joi.alternatives().conditional('blogType', {
      is: 'event',
      then: Joi.date().required(),
      otherwise: Joi.forbidden(),
    }),
    endDate: Joi.alternatives().conditional('blogType', {
      is: 'event',
      then: Joi.date().required(),
      otherwise: Joi.forbidden(),
    }),
    likeType: Joi.string().valid(...LikesArr),
    image: Joi.string(),
    company: Joi.object()
  })

  return schema.tailor(reqType).validate(blog)
}

export default Blog
