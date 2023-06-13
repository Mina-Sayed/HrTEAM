
import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface IPost {
    save(): unknown;
    title: string;
    content: string;
    image: string;
    creator: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const PostSchema = new Schema<IPost>({
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

export default mongoose.model<IPost>("Post", PostSchema);



// make controller
// Path: src\controllers\posts.ts
// import { RequestHandler } from "express";
// import { validationResult } from "express-validator";
// import mongoose from "mongoose";
//
// import Post, { IPost } from "../models/posts";
// import User from "../models/user";
//
// export const getPosts: RequestHandler = async (req, res, next) => {
//     try {
//         const posts = await Post.find().populate("creator");
//         res.status(200).json({
//             message: "Fetched posts successfully.",
//             posts,
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };
//
// export const createPost: RequestHandler = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error("Validation failed, entered data is incorrect.");
//         (error as any).statusCode = 422;
//         throw error;
//     }
//     if (!req.file) {
//         const error = new Error("No image provided.");
//         (error as any).statusCode = 422;
//         throw error;
//     }
//     const imageUrl = req.file.path;
//     const { title, content } = req.body;
//     const post = new Post({
//         title,
//         content,
//         image: imageUrl,
//         creator: req.userId,
//     });
//     try {
        // await post.save(); // save to database (mongodb)
        // const user = await User.findById(req.userId);
        // (user as any).posts.push(post);
        // await user.save();
        // res.status(201).json({
        //     message: "Post created successfully!",
        //     post,
        //     creator: { _id: user._id, name: user.name },
        // });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };
//
// export const getPost: RequestHandler = async (req, res, next) => {
//     const { postId } = req.params;
//     try {


