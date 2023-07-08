"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./../../middlewares/validate");
const acsses_1 = require("./../../middlewares/acsses");
const enums_1 = require("./../../types/enums");
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const blog_controller_1 = require("../../controllers/blog/blog.controller");
const blog_model_1 = require("../../models/blog.model");
const router = (0, express_1.Router)();
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE))
    .get(blog_controller_1.getAllBlogs)
    .post((0, validate_1.validator)(blog_model_1.blogValidation, 'post'), blog_controller_1.addBlog);
router
    .route('/me')
    .all(auth_1.AuthenticationMiddleware)
    .get(blog_controller_1.MyBlog);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), blog_controller_1.getBlogById)
    .put((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), blog_controller_1.updateBlog)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), blog_controller_1.deleteBlog);
router
    .route('/addLike/:blogId')
    .put(auth_1.AuthenticationMiddleware, (0, validate_1.validator)(blog_model_1.blogValidation, 'put'), blog_controller_1.addLike);
router.route('/removeLike/:blogId').put(auth_1.AuthenticationMiddleware, blog_controller_1.removeLike);
exports.default = router;
