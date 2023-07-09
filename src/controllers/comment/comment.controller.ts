import { Response } from "express";
import { AuthenticatedReq } from "../../middlewares/auth";
import Blog from "../../models/blog.model";
import Comment from "../../models/comment.model";

//DESC Add Comment
//ROUTE POST/ porfile/api/v1/comment
export const addCommnets = async (req: AuthenticatedReq, res: Response) => {
    // id Guess i dont need to check if comment already exist
    // add new comment 
    if (req.body.active)
        req.body.active = false;
    const comment = new Comment({ ...req.body })
    await comment.save();

    const returnedCommnent = await Comment.findById(comment._id).populate('user')
    const blog = await Blog.findByIdAndUpdate(req.body.blog, {
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
    ])
    res.status(200).send({ success: true, message_en: 'Comment Added Successfully', blog })

}
//DESC chage the comment active state  Comment
//ROUTE PUT/ porfile/api/v1/comment/status/:id
export const permissionToAddComment = async (req: AuthenticatedReq, res: Response) => {
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(id, {
        $set: { active: req.body.active },

    }, { new: true })
    if (!comment)
        return res.status(400).send({ success: false, message_en: 'Comment Not Found' })
    res.status(200).send({ success: true, message_en: 'Comment State UPdated Successfully' })
}

//DESC update Comment contnet
//ROUTE put/ porfile/api/v1/comment/:id

export const updateComment = async (req: AuthenticatedReq, res: Response) => {
    const { id } = req.params;
    // first check if the user is the one hwo create the comment or not 

    const comment: any = await Comment.findById(id).populate('user', 'role')




    if (comment.user._id.toString() != req.user?._id.toString())
        return res.status(400).send({ success: false, message_en: `can't updated the comment cause you are not the admin of it` })
    const updatedComment = await Comment.findByIdAndUpdate(id, { ...req.body }, { new: true })
    res.status(200).send({ success: true, message_en: 'comment updated successfully', comment: updatedComment })

}


//DESC delete Comment 
//ROUTE DELETE/ porfile/api/v1/comment/:blogId/:commentId

export const deleteComment = async (req: AuthenticatedReq, res: Response) => {

    const { blogId, commentId } = req.params;
    const comment: any = await Comment.findById(commentId)

    // if (!(comment?.user._id.toString() == req.user?._id.toString() || req.user?.role === 'admin'))
    //     return res.status(400).send({ success: false, message_en: `can't Delete the comment cause you are not the admin of it` })
    await Comment.findByIdAndDelete(commentId);
    // lets find the blog to delete the ref 
    let blog = await Blog.findByIdAndUpdate(blogId, {
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
    ])
    // delete the refrence from the blog itSelf

    if (!deleteComment) {
        return res.status(400).send({ success: false, message_en: `can't Delete the comment beCause it's not found` })

    }
    res.status(200).send({ success: true, message_en: 'Comment Deleted Successfully', blog })

}

//DESC add reply to the comment
//Route POST /profile/api/v1/comment/reply/:blogId/:commentId
export const addReply = async (req: AuthenticatedReq, res: Response) => {
    // comment id 
    const { blogId, commentId } = req.params;
    const commentReply = new Comment({ ...req.body })
    await commentReply.save()
    // get Reply id to add in the comment refrences
    const replyId = commentReply._id;


    const updatedReply = await Comment.findByIdAndUpdate(commentId, {
        $push: { replys: replyId },
    }, { new: true })

    let blog = await Blog.findById(blogId).populate([
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
    ])
    if (!updatedReply)
        return res.status(400).send({ success: false, message_en: 'Comment Not Found' })

    res.status(200).send({ success: true, message_en: 'Reply Added Successfully', blog })
}


//DESC update reply to the comment
//Route put /profile/api/v1/comment/reply/:id

export const updateReply = async (req: AuthenticatedReq, res: Response) => {
    const { id } = req.params;
    const commentReply: any = await Comment.findById(id).populate('user')
    if (commentReply.user._id.toString() != req.user?._id.toString())
        return res.status(400).send({ success: false, message_en: `can't update the comment cause you are not the admin of it` })
    const updatedReply = await Comment.findByIdAndUpdate(id, { ...req.body }, { new: true })
    if (!updateReply)
        return res.status(400).send({ success: false, message_en: 'Reply NOT Found' })
    res.status(200).send({ success: true, message_en: 'Reply Updated Successfully' })

}

//DESC delete reply to the comment
//Route put /profile/api/v1/comment/reply/:id
export const deleteReply = async (req: AuthenticatedReq, res: Response) => {

    //reply id
    const { id } = req.params;
    const commentReply: any = await Comment.findById(id)

    if (commentReply.user.toString() != req.user?._id.toString())
        return res.status(400).send({ success: false, message_en: `can't update the comment reply cause you are not the admin of it` })
    // first delete the refrence from the original comment 
    const findComment = await Comment.updateOne({ replys: { $elemMatch: { $eq: commentReply._id } } },
        { $pull: { replys: commentReply._id } })
    await Comment.findByIdAndDelete(id)
    if (!updateReply)
        return res.status(400).send({ success: false, message_en: 'Reply NOT Found' })
    res.status(200).send({ success: true, message_en: 'Reply Updated Successfully' })



}
