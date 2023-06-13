import {Response} from "express";
import {AuthenticatedReq} from "../../middlewares/auth";
import Comment from "../../models/comment";
import Blog from "../../models/blog";

//DESC add reply to the comment
//Route POST /profile/api/v1/reply

export const addReply = async (req: AuthenticatedReq, res: Response) =>
{
    const commentReply = new Comment({...req.body});
    let {blogId, commentId} = req.params;
    await commentReply.save();
    // get Reply id to add in the comment refrences
    const replyId = commentReply._id;
    const updatedReply = await Comment.updateOne({_id: commentId}, {
        $push: {replys: replyId}
    }, {new: true});
    if (!updatedReply)
        return res.status(400).send({success: false, message_en: 'Comment Not Found'});
    let blog = await Blog.findById(blogId).populate([
        {path: 'user', model: "User"},
        {
            path: 'comments', model: "Comment",
            populate: [
                {path: 'user', model: "User"},
                {path: 'replys', model: "Comment"}
            ]
        },
    ]);
    res.status(200).send({success: true, message_en: 'Reply Added Successfully', blog});
};

