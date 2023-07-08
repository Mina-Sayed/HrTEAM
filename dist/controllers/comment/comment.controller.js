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
exports.deleteReply = exports.updateReply = exports.addReply = exports.deleteComment = exports.updateComment = exports.permissionToAddComment = exports.addCommnets = void 0;
const blog_model_1 = __importDefault(require("../../models/blog.model"));
const comment_model_1 = __importDefault(require("../../models/comment.model"));
//DESC Add Comment
//ROUTE POST/ porfile/api/v1/comment
const addCommnets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id Guess i dont need to check if comment already exist
    // add new comment 
    if (req.body.active)
        req.body.active = false;
    const comment = new comment_model_1.default(Object.assign({}, req.body));
    yield comment.save();
    const returnedCommnent = yield comment_model_1.default.findById(comment._id).populate('user');
    const blog = yield blog_model_1.default.findByIdAndUpdate(req.body.blog, {
        $push: { comments: comment._id }
    }, { new: true }).populate([
        { path: 'user', model: "User" },
        {
            path: 'comments', model: "Comment",
            populate: [
                { path: 'user', model: "User" },
                { path: 'replys', model: "Comment" }
            ]
        },
    ]);
    res.status(200).send({ success: true, message_en: 'Comment Added Successfully', blog });
});
exports.addCommnets = addCommnets;
//DESC chage the comment active state  Comment
//ROUTE PUT/ porfile/api/v1/comment/status/:id
const permissionToAddComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comment = yield comment_model_1.default.findByIdAndUpdate(id, {
        $set: { active: req.body.active },
    }, { new: true });
    if (!comment)
        return res.status(400).send({ success: false, message_en: 'Comment Not Found' });
    res.status(200).send({ success: true, message_en: 'Comment State UPdated Successfully' });
});
exports.permissionToAddComment = permissionToAddComment;
//DESC update Comment contnet
//ROUTE put/ porfile/api/v1/comment/:id
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // first check if the user is the one hwo create the comment or not 
    const comment = yield comment_model_1.default.findById(id).populate('user', 'role');
    if (comment.user._id.toString() != ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()))
        return res.status(400).send({ success: false, message_en: `can't updated the comment cause you are not the admin of it` });
    const updatedComment = yield comment_model_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
    res.status(200).send({ success: true, message_en: 'comment updated successfully', comment: updatedComment });
});
exports.updateComment = updateComment;
//DESC delete Comment 
//ROUTE DELETE/ porfile/api/v1/comment/:blogId/:commentId
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId, commentId } = req.params;
    const comment = yield comment_model_1.default.findById(commentId);
    // if (!(comment?.user._id.toString() == req.user?._id.toString() || req.user?.role === 'admin'))
    //     return res.status(400).send({ success: false, message_en: `can't Delete the comment cause you are not the admin of it` })
    yield comment_model_1.default.findByIdAndDelete(commentId);
    // lets find the blog to delete the ref 
    let blog = yield blog_model_1.default.findByIdAndUpdate(blogId, {
        $pull: { comments: commentId }
    }, { new: true }).populate([
        { path: 'user', model: "User" },
        {
            path: 'comments', model: "Comment",
            populate: [
                { path: 'user', model: "User" },
                { path: 'replys', model: "Comment" }
            ]
        },
    ]);
    // delete the refrence from the blog itSelf
    if (!exports.deleteComment) {
        return res.status(400).send({ success: false, message_en: `can't Delete the comment beCause it's not found` });
    }
    res.status(200).send({ success: true, message_en: 'Comment Deleted Successfully', blog });
});
exports.deleteComment = deleteComment;
//DESC add reply to the comment
//Route POST /profile/api/v1/comment/reply/:blogId/:commentId
const addReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // comment id 
    const { blogId, commentId } = req.params;
    const commentReply = new comment_model_1.default(Object.assign({}, req.body));
    yield commentReply.save();
    // get Reply id to add in the comment refrences
    const replyId = commentReply._id;
    const updatedReply = yield comment_model_1.default.findByIdAndUpdate(commentId, {
        $push: { replys: replyId },
    }, { new: true });
    let blog = yield blog_model_1.default.findById(blogId).populate([
        { path: 'user', model: "User" },
        {
            path: 'comments', model: "Comment",
            populate: [
                { path: 'user', model: "User" },
                {
                    path: 'replys', model: "Comment",
                    populate: { path: 'user', model: "User" }
                }
            ]
        },
    ]);
    if (!updatedReply)
        return res.status(400).send({ success: false, message_en: 'Comment Not Found' });
    res.status(200).send({ success: true, message_en: 'Reply Added Successfully', blog });
});
exports.addReply = addReply;
//DESC update reply to the comment
//Route put /profile/api/v1/comment/reply/:id
const updateReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    const commentReply = yield comment_model_1.default.findById(id).populate('user');
    if (commentReply.user._id.toString() != ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()))
        return res.status(400).send({ success: false, message_en: `can't update the comment cause you are not the admin of it` });
    const updatedReply = yield comment_model_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
    if (!exports.updateReply)
        return res.status(400).send({ success: false, message_en: 'Reply NOT Found' });
    res.status(200).send({ success: true, message_en: 'Reply Updated Successfully' });
});
exports.updateReply = updateReply;
//DESC delete reply to the comment
//Route put /profile/api/v1/comment/reply/:id
const deleteReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    //reply id
    const { id } = req.params;
    const commentReply = yield comment_model_1.default.findById(id);
    if (commentReply.user.toString() != ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString()))
        return res.status(400).send({ success: false, message_en: `can't update the comment reply cause you are not the admin of it` });
    // first delete the refrence from the original comment 
    const findComment = yield comment_model_1.default.updateOne({ replys: { $elemMatch: { $eq: commentReply._id } } }, { $pull: { replys: commentReply._id } });
    yield comment_model_1.default.findByIdAndDelete(id);
    if (!exports.updateReply)
        return res.status(400).send({ success: false, message_en: 'Reply NOT Found' });
    res.status(200).send({ success: true, message_en: 'Reply Updated Successfully' });
});
exports.deleteReply = deleteReply;
