"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createComment = void 0;
const posts_1 = __importDefault(require("../../models/posts"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = require("mongoose");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Set the destination folder where the uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg"); // Set the file naming convention
    },
});
// Create a multer instance with the storage configuration
const upload = (0, multer_1.default)({ storage: storage });
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, comments, image } = req.body;
        // Access the uploaded file through req.file
        if (req.file) {
            console.log("Uploaded image:", req.file.filename);
            // Create a new post with the file path
            const newPost = new posts_1.default({
                title,
                content,
                image: req.file.path,
                comments: Array.isArray(comments) ? comments.map((comment) => new mongoose_1.Types.ObjectId(comment)) : [],
            });
            yield newPost.save();
            return res.status(201).json(newPost);
        }
        else {
            console.log("No image uploaded");
            // Create a new post without the file path
            const newPost = new posts_1.default({
                title,
                content,
                comments: Array.isArray(comments) ? comments.map((comment) => new mongoose_1.Types.ObjectId(comment)) : [],
            });
            yield newPost.save();
            return res.status(201).json(newPost);
        }
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Failed to create post" });
    }
});
exports.createComment = createComment;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield posts_1.default.find();
        return res.status(200).json(posts);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const post = yield posts_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(post);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { title, content, creator } = req.body;
        const updatedPost = yield posts_1.default.findByIdAndUpdate(postId, { title, content, creator }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(updatedPost);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const deletedPost = yield posts_1.default.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.deletePost = deletePost;
