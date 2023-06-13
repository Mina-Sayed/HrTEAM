import { validator } from "../../middlewares/validator";
import { Router } from "express";
import {
    addComment,
    addReply,
    deleteComment,
    deleteReply,
    updateComment,
    updateReply,
} from "../../controllers/comment/comment.controller";
import { authMiddleware } from "../../middlewares/auth";
import { commentValidation } from "../../models/comment";


const router: Router = Router();

router.route("/")
    .post(validator(commentValidation,
            "post"),
        addComment);


router.route("/delete/:blogId/:commentId")
    .delete(authMiddleware,
        deleteComment);

router.route("/update/:id").all(authMiddleware)
    .put(validator(commentValidation,
            "put"),
        updateComment);

router.route("/reply/:blogId/:commentId").all(authMiddleware)
    .post(validator(commentValidation,
            "post"),
        addReply)
    .put(updateReply)
    .delete(deleteReply);

export default router;