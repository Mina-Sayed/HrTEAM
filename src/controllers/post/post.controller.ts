import { Request, Response } from "express";
import Post,{ IPost } from "../../models/posts";


export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, comments, image }: IPost = req.body;
    const newPost = await Post.create({ title, content, comments, image });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
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
