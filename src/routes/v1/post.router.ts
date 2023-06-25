import express from "express";
import { createComment, getAllPosts, getPostById, updatePost, deletePost } from "../../controllers/post/post.controller";

const router = express.Router();

// Create a new post
router.post("/", createComment);

// Get all posts
router.get("/", getAllPosts);

// Get a post by ID
router.get("/:postId", getPostById);

// Update a post
router.put("/:postId", updatePost);

// Delete a post
router.delete("/:postId", deletePost);

export default router;
