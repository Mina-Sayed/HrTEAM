"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../../controllers/post/post.controller");
const uploads_1 = require("../../middlewares/uploads");
const router = express_1.default.Router();
// Create a new post
router.post("/", uploads_1.upload.single("image"), post_controller_1.createComment);
// Get all posts
router.get("/", post_controller_1.getAllPosts);
// Get a post by ID
router.get("/:postId", post_controller_1.getPostById);
// Update a post
router.put("/:postId", post_controller_1.updatePost);
// Delete a post
router.delete("/:postId", post_controller_1.deletePost);
exports.default = router;
