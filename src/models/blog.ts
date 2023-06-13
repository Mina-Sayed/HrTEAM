import mongoose, { Schema } from "mongoose";
import { BlogType } from "../types/blogType";
import { Likes, LikesArr } from "../types/likes";
import { ObjectId } from "mongodb";


export interface IBlog
{
  title: String;
  description: String;
  image: String;
  comments: [ mongoose.Schema.Types.ObjectId ];
  likes: [ {
    user: mongoose.Schema.Types.ObjectId;
    likeType: Likes
  } ];
  startDate: Date;
  endDate: Date;
  blogType: BlogType;
  user: mongoose.Schema.Types.ObjectId;
  // keywordDescription: String
  // keywords: [String]
  company: ObjectId;
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
      "https://tse4.mm.bing.net/th?id=OIP.Z5BlhFYs_ga1fZnBWkcKjQHaHz&pid=Api&P=0",
    // required:[true , 'Please add an Image for Your Blog']
  },
  // keywordDescription: { type: String },
  // keywords: [String],
  comments: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  } ],
  likes: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: ObjectId,
    ref: "company",
  },
}, {
  timestamps: true,
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
