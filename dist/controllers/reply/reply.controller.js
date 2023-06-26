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
exports.addReply = void 0;
const comment_model_1 = __importDefault(require("../../models/comment.model"));
const blog_model_1 = __importDefault(require("../../models/blog.model"));
//DESC add reply to the comment
//Route POST /profile/api/v1/reply
const addReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentReply = new comment_model_1.default(Object.assign({}, req.body));
    let { blogId, commentId } = req.params;
    yield commentReply.save();
    // get Reply id to add in the comment refrences
    const replyId = commentReply._id;
    const updatedReply = yield comment_model_1.default.updateOne({ _id: commentId }, {
        $push: { replys: replyId }
    }, { new: true });
    if (!updatedReply)
        return res.status(400).send({ success: false, message_en: 'Comment Not Found' });
    let blog = yield blog_model_1.default.findById(blogId).populate([
        { path: 'user', model: "User" },
        {
            path: 'comments', model: "Comment",
            populate: [
                { path: 'user', model: "User" },
                { path: 'replys', model: "Comment" }
            ]
        },
    ]);
    res.status(200).send({ success: true, message_en: 'Reply Added Successfully', blog });
});
exports.addReply = addReply;
