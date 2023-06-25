import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Post, { IPost } from "../../models/posts";

export const createPost = async (req: Request, res: Response) => {
    try {
        // const form = formidable({ multiples: true });

        // await form.parse(req, async (err: any, fields: Fields, files: Files) => {
        //     if (err) {
        //         return res.status(400).json({ error: "Error parsing form data" });
        //     }

        //     const { title, content, creator } = fields;

        //     // Process the uploaded file
        //     const imageFile = files.image as formidable.File;
        //     if (!imageFile) {
        //         return res.status(400).json({ error: "Image file is required" });
        //     }

        //     // Generate a unique filename
        //     const imageFilename = `${uuidv4()}${path.extname(imageFile.name || "")}`;

        //     // Move the file to a desired location
        //     const uploadPath = path.join(__dirname, "../uploads", imageFilename);
        //     fs.renameSync(imageFile.path || "", uploadPath);

        //     const newPost: IPost = new Post({
        //         title,
        //         content,
        //         image: imageFilename,
        //         creator,
        //     });

        //     const savedPost = await newPost.save();

        //     return res.status(201).json({ message: "Post created successfully", post: savedPost });
        // });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

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
