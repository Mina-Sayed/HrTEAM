import { validator } from './../../middlewares/validate';
import { Router } from "express";
import { addCommnets, addReply, deleteComment, deleteReply, updateComment, updateReply } from "../../controllers/comment/comment.controller";
import { AuthenticationMiddleware } from "../../middlewares/auth";
import { commentValidation } from "../../models/comment.model";

const router: Router = Router();

router.route('/')
    .post(validator(commentValidation, 'post'), addCommnets)


router.route('/delete/:blogId/:commentId')
    .delete(AuthenticationMiddleware, deleteComment)

router.route('/update/:id').all(AuthenticationMiddleware)
    .put(validator(commentValidation, 'put'), updateComment)

router.route('/reply/:blogId/:commentId').all(AuthenticationMiddleware)
    .post(validator(commentValidation, 'post'), addReply)
    .put(updateReply)
    .delete(deleteReply)

export default router;