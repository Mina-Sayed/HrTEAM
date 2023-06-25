import express from "express";
import { createComment, getAllPosts, getPostById, updatePost, deletePost } from "../../controllers/post/post.controller";
import { upload } from "../../middlewares/uploads";

const router = express.Router();

// Create a new post
router.post("/", upload.single("image"), createComment);

// Get all posts
router.get("/", getAllPosts);

// Get a post by ID
router.get("/:postId", getPostById);

// Update a post
router.put("/:postId", updatePost);

// Delete a post
router.delete("/:postId", deletePost);

export default router;
