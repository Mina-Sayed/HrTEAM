"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./../../middlewares/validate");
const express_1 = require("express");
const comment_controller_1 = require("../../controllers/comment/comment.controller");
const auth_1 = require("../../middlewares/auth");
const comment_model_1 = require("../../models/comment.model");
const router = (0, express_1.Router)();
router.route('/')
    .post((0, validate_1.validator)(comment_model_1.commentValidation, 'post'), comment_controller_1.addCommnets);
router.route('/delete/:blogId/:commentId')
    .delete(auth_1.AuthenticationMiddleware, comment_controller_1.deleteComment);
router.route('/update/:id').all(auth_1.AuthenticationMiddleware)
    .put((0, validate_1.validator)(comment_model_1.commentValidation, 'put'), comment_controller_1.updateComment);
router.route('/reply/:blogId/:commentId').all(auth_1.AuthenticationMiddleware)
    .post((0, validate_1.validator)(comment_model_1.commentValidation, 'post'), comment_controller_1.addReply)
    .put(comment_controller_1.updateReply)
    .delete(comment_controller_1.deleteReply);
exports.default = router;
