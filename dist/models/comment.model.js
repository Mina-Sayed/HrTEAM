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
exports.commentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
const commentSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    blog: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Blog',
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    rating: {
        type: Number,
    },
    replys: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
const commentValidation = (comment, reqType) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        user: joi_1.default.object().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        blog: joi_1.default.object().alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
        rating: joi_1.default.number(),
        replys: joi_1.default.array().items(joi_1.default.object())
    });
    return schema.tailor(reqType).validate(comment);
};
exports.commentValidation = commentValidation;
