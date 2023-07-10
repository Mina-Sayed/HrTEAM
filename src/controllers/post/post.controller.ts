import { Request, Response } from "express";
import Post,{ IPost } from "../../models/posts";
// import multer from "multer";
// import { Types } from "mongoose";

// Controller for creating a new post
/**
 * Create a new comment.
 * 
 * @param req - The request object.
 * @param res - The response object.
 */
export const createComment = async (req: Request, res: Response) => {
    try {
      const { title, content } = req.body;
      console.log(req.body)
    //   const image = req.file?.fieldname ? req.file.path : ""; // Assuming you have configured Multer middleware to handle file uploads
       const post: IPost = new Post({
        ...req.body,comments:[]
      });
       const savedPost = await post.save();
      // Include the image name in the response
      savedPost.image = req.body?.image ? req.body?.image : ""; 
       res.status(201).json(savedPost);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Failed to create a new post" });
    }
  };



export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { title, content, creator } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, creator },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
