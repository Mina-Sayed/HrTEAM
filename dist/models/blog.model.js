"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const blogType_1 = require("../types/blogType");
const likes_1 = require("../types/likes");
const mongodb_1 = require("mongodb");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: 'https://tse4.mm.bing.net/th?id=OIP.Z5BlhFYs_ga1fZnBWkcKjQHaHz&pid=Api&P=0',
        // required:[true , 'Please add an Image for Your Blog']
    },
    // keywordDescription: { type: String },
    // keywords: [String],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: {
        type: [
            {
                user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
                likeType: {
                    type: String,
                    enum: likes_1.LikesArr,
                },
            },
        ],
        default: [],
    },
    startDate: Date,
    endDate: Date,
    blogType: {
        type: String,
        enum: blogType_1.BlogType,
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    company: {
        type: mongodb_1.ObjectId,
        ref: "company"
    }
}, {
    timestamps: true
});
const Blog = mongoose_1.default.model('Blog', blogSchema);
const blogValidation = (blog, reqType) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        description: joi_1.default.string().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        // meta: Joi.string().alter({
        //   post: (schema: any) => schema.required(),
        //   put: (schema: any) => schema.forbidden(),
        // }),
        // keywords: Joi.array().items(Joi.string()),
        // keywordDescription: Joi.string().alter({
        //   post: (schema: any) => schema.required(),
        //   put: (schema: any) => schema.forbidden(),
        // }),
        comments: joi_1.default.array().items(joi_1.default.object()),
        likes: joi_1.default.array().items({
            user: joi_1.default.object().required(),
        }),
        blogType: joi_1.default.string().valid('event', 'blog'),
        startDate: joi_1.default.alternatives().conditional('blogType', {
            is: 'event',
            then: joi_1.default.date().required(),
            otherwise: joi_1.default.forbidden(),
        }),
        endDate: joi_1.default.alternatives().conditional('blogType', {
            is: 'event',
            then: joi_1.default.date().required(),
            otherwise: joi_1.default.forbidden(),
        }),
        likeType: joi_1.default.string().valid(...likes_1.LikesArr),
        image: joi_1.default.string(),
        company: joi_1.default.object()
    });
    return schema.tailor(reqType).validate(blog);
};
exports.blogValidation = blogValidation;
exports.default = Blog;
