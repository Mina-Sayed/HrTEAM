import { Request, Response } from "express";
import Post,{ IPost } from "../../models/posts";
import multer from "multer";
import { Types } from "mongoose";





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder where the uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg"); // Set the file naming convention
  },
});



// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });






export const createComment = async (req: Request, res: Response) => {
  try {
    const { title, content, comments } = req.body;

    // Access the uploaded file through req.file
    if (req.file) {
      console.log("Uploaded image:", req.file);

      // Create a new post with the file path
      const newPost: IPost = new Post({
        title,
        content,
        image: (req.file as Express.Multer.File).path, // Set the file path in the database
        comments: Array.isArray(comments) ? comments.map((comment: string) => new Types.ObjectId(comment)) : [],
      });

      await newPost.save();

      return res.status(201).json(newPost);
    } else {
      console.log("No image uploaded");

      // Create a new post without the file path
      const newPost: IPost = new Post({
        title,
        content,
        comments: Array.isArray(comments) ? comments.map((comment: string) => new Types.ObjectId(comment)) : [],
      });

      await newPost.save();

      return res.status(201).json(newPost);
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Failed to create post" });
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
