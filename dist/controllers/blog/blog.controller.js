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
exports.removeLike = exports.addLike = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.MyBlog = exports.addBlog = exports.getAllBlogs = void 0;
const blog_model_1 = __importDefault(require("../../models/blog.model"));
const likes_1 = require("../../types/likes");
const enums_1 = require("../../types/enums");
const Company_1 = require("../../models/Company");
//Desc : get all  Blogs
//Route: GET /profile/api/v1/blog
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let blogs = [];
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === enums_1.Roles.ADMIN) {
        blogs = yield blog_model_1.default.find({ company: req.user.company }).populate([
            { path: 'user', model: "User" },
            {
                path: 'comments', model: "Comment",
                populate: [
                    { path: 'user', model: "User" },
                    { path: 'replys', model: "Comment" }
                ]
            },
        ]);
    }
    else if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === enums_1.Roles.ROOT) {
        // const compnies = (
        //   await Company.find({ owner: req.user?._id })
        // ).map((company) => company._id.toString())
        blogs = yield blog_model_1.default.find({ company: req.query.company }).populate([
            {
                path: 'comments',
                model: 'Comment',
                populate: [
                    { path: 'user', model: 'User' },
                    {
                        path: 'replys',
                        model: 'Comment',
                        populate: {
                            path: 'user',
                            model: 'User',
                        },
                    },
                ],
            },
            {
                path: 'user',
                model: 'User',
            },
        ]);
    }
    else if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === enums_1.Roles.EMPLOYEE) {
        blogs = yield blog_model_1.default.find({ company: req.user.company }).populate([
            {
                path: 'comments',
                model: 'Comment',
                populate: [
                    { path: 'user', model: 'User' },
                    {
                        path: 'replys',
                        model: 'Comment',
                        populate: {
                            path: 'user',
                            model: 'User',
                        },
                    },
                ],
            },
            {
                path: 'user',
                model: 'User',
            },
        ]);
    }
    if (blogs.length <= 0) {
        return res
            .status(400)
            .send({ success: false, message_en: 'You do not have any blogs yet.' });
    }
    res.status(200).send({
        success: true,
        message_en: 'Blogs Are Fetched Successfully',
        cout: blogs.length,
        blogs,
    });
});
exports.getAllBlogs = getAllBlogs;
//Desc : Add Blog
//Route: POST /profile/api/v1/blog
const addBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    //check if the blog is exist
    const user = req.user;
    if (user.role === 'root') {
        if (!req.body.company && !user.company)
            return res.status(400).send({ error_en: 'Company is requierd ' });
        const compnies = (yield Company_1.Company.find({ owner: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id })).map((company) => company._id.toString());
        if (!compnies.includes(req.body.company ? req.body.company : user.company.toString()))
            return res
                .status(400)
                .send({ message_en: 'You can not add any blog in this company' });
    }
    const blog = yield blog_model_1.default.findOne({ title: req.body.title });
    if (blog)
        return res
            .status(400)
            .send({ success: false, message_en: 'Blog Already Exist' });
    const newBlog = new blog_model_1.default(Object.assign(Object.assign({}, req.body), { user: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id, company: req.body.company ? req.body.company : (_f = req.user) === null || _f === void 0 ? void 0 : _f.company }));
    yield newBlog.save();
    const copyNewBlog = yield blog_model_1.default.findById(newBlog._id).populate([
        {
            path: 'comments',
            model: 'Comment',
            populate: [
                {
                    path: 'replys',
                    model: 'Comment',
                    populate: {
                        path: 'user',
                        model: 'User',
                    },
                },
                {
                    path: 'user',
                    model: 'User',
                },
            ],
        },
    ]);
    res.status(200).send({
        success: true,
        message_en: 'Blog is Added Successfully',
        newBlog: copyNewBlog,
    });
});
exports.addBlog = addBlog;
//Desc : get my blogs
//Route: POST /profile/api/v1/blog/me
const MyBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the blog is exist
    const user = req.user;
    const myBlogs = yield blog_model_1.default.find({ user: user._id }).populate([
        { path: 'user', model: "User" },
        {
            path: 'comments', model: "Comment",
            populate: {
                path: "replys", model: "Comment",
                populate: { path: "user", model: "User" }
            }
        },
    ]);
    res.status(200).send({
        success: true,
        newBlog: myBlogs,
    });
});
exports.MyBlog = MyBlog;
//Desc : get Blog
//Route: GET /profile/api/v1/blog/:id
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield blog_model_1.default.findById(id).populate([
        { path: 'user', model: "User" },
        {
            path: 'comments', model: "Comment",
            populate: [
                { path: 'user', model: "User" },
                {
                    path: 'replys', model: "Comment", populate: {
                        path: 'user', model: "User"
                    }
                }
            ]
        },
    ]);
    if (!blog)
        return res
            .status(400)
            .send({ success: false, message_en: 'Blog is Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Blog is Fetched Successfully', blog });
});
exports.getBlogById = getBlogById;
//Desc : update Blog
//Route: PUT /profile/api/v1/blog/:id
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield blog_model_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true }).populate([
        { path: 'user', model: 'User' },
        {
            path: 'comments',
            model: 'Comment',
            populate: {
                path: 'replys',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User',
                },
            },
        },
    ]);
    if (!blog)
        return res
            .status(400)
            .send({ success: false, message_en: 'Blog is Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Blog updated Successfully', blog });
});
exports.updateBlog = updateBlog;
//Desc : delete Blog
//Route: DELTE /profile/api/v1/blog/:id
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield blog_model_1.default.findByIdAndDelete(id);
    if (!blog)
        return res
            .status(400)
            .send({ success: false, message_en: 'Blog is Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Blog Deleted Successfully' });
});
exports.deleteBlog = deleteBlog;
//DESC add user like to the blog : user can be any one not restriction required
//Route : PUT /profile/api/v1/blog/addLike/:blogId
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g._id;
    const { blogId } = req.params;
    const { likeType } = req.body;
    if (likeType) {
        if (!likes_1.LikesArr.includes(likeType))
            return res
                .status(400)
                .send({ success: false, message_en: 'InValid Like Type' });
    }
    else {
        return res.status(400).send({
            success: false,
            message_en: 'You should add valid like type to add like on the blog',
        });
    }
    const foundUser = yield blog_model_1.default.findOne({ _id: blogId }, { likes: { $elemMatch: { user: userId } } });
    if (foundUser.likes[0]) {
        if (foundUser.likes[0].likeType === likeType) {
            yield blog_model_1.default.findByIdAndUpdate({ _id: blogId }, { $pull: { likes: { user: userId, likeType: likeType } } }, { new: true });
            const blog = yield blog_model_1.default.findById(blogId).populate({
                path: 'comments',
                model: 'Comment',
                populate: [
                    { path: 'user', model: 'User' },
                    {
                        path: 'replys',
                        model: 'Comment',
                        populate: {
                            path: 'user',
                            model: 'User',
                        },
                    },
                ],
            });
            return res.status(200).send({
                success: true,
                messsage_en: 'Like removed from the Blog Successfully',
                blog,
                toggling: true
            });
        }
        else if (foundUser.likes[0].likeType !== likeType) {
            yield blog_model_1.default.updateOne({ _id: blogId, 'likes.user': userId }, { $set: { 'likes.$.likeType': likeType } }, { new: true });
            const blog = yield blog_model_1.default.findById(blogId).populate({
                path: 'comments',
                model: 'Comment',
                populate: [
                    { path: 'user', model: 'User' },
                    {
                        path: 'replys',
                        model: 'Comment',
                        populate: {
                            path: 'user',
                            model: 'User',
                        },
                    },
                ],
            });
            return res.status(200).send({
                success: true,
                messsage_en: 'Like updated from the Blog Successfully',
                blog,
                toggling: false
            });
        }
    }
    // if (foundUser) {
    //   const blog = await Blog.updateOne(
    //     { _id: blogId },
    //     { $pull: { likes: { user: userId } } }
    //   );
    //   return res.status(200).send({
    //     success: true,
    //     messsage_en: "Like removed from the Blog Successfully",
    //     blog,
    //   });
    // }
    const data = { user: userId, likeType };
    const blog = yield blog_model_1.default.findByIdAndUpdate(blogId, {
        $push: { likes: data },
    }, { new: true });
    if (!blog)
        return res
            .status(400)
            .send({ success: false, message_en: 'Blog Not Found To Add Like To it' });
    const newBlog = yield blog_model_1.default.findById(blogId).populate({
        path: 'comments',
        model: 'Comment',
        populate: [
            { path: 'user', model: 'User' },
            {
                path: 'replys',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User',
                },
            },
        ],
    });
    res.status(200).send({
        success: true,
        messsage_en: 'Like Added To the Blog Successfully',
        blog: newBlog,
        toggling: false
    });
});
exports.addLike = addLike;
//Desc remove like from the blog : any user can access the dislike endPoint
//Route : PUT/ profile/api/v1/blog/removeLike/:blogId
const removeLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const userId = (_h = req.user) === null || _h === void 0 ? void 0 : _h._id;
    const { blogId } = req.params;
    const blog = yield blog_model_1.default.updateOne({ _id: blogId }, { $pull: { likes: userId } });
    if (!blog) {
        return res
            .status(400)
            .send({ success: false, message_en: 'Blog Not Found To Add Like To it' });
    }
    res.status(200).send({
        success: true,
        messsage_en: 'Like removed from the Blog Successfully',
        blog,
    });
});
exports.removeLike = removeLike;
