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
exports.deleteEmployee = exports.deleteAdmin = exports.deleteRoot = exports.deleteSuperAdmin = void 0;
const OverTime_1 = require("./../../models/OverTime");
const Break_1 = require("./../../models/Break");
const User_1 = __importDefault(require("../../models/User"));
const enums_1 = require("../../types/enums");
const payrol_1 = __importDefault(require("../../models/payrol"));
const Contract_1 = __importDefault(require("../../models/Contract"));
const attendenc_model_1 = require("../../models/attendenc.model");
const blog_model_1 = __importDefault(require("../../models/blog.model"));
const Request_1 = __importDefault(require("../../models/Request"));
const task_1 = __importDefault(require("../../models/task"));
const Documents_1 = require("../../models/Documents");
const comment_model_1 = __importDefault(require("../../models/comment.model"));
const notification_model_1 = require("../../models/notification.model");
//@desc         delete superadmin
//@route        DELETE /api/v1/users/superadmins/:id
//@access       private(super admins)
const deleteSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedSuperAdmin = yield User_1.default.deleteOne({
        _id: req.params.id,
        role: enums_1.Roles.SUPER_ADMIN,
    });
    if (deletedSuperAdmin === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'super admin is deleted successfully',
        data: deletedSuperAdmin,
    });
});
exports.deleteSuperAdmin = deleteSuperAdmin;
//@desc         delete root
//@route        DELETE /api/v1/users/roots/:id
//@access       private(super admins)
const deleteRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedRoot = yield User_1.default.deleteOne({ _id: req.params.id, role: enums_1.Roles.ROOT }, { new: true });
    if (deletedRoot === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'root is deleted successfully',
        data: deletedRoot,
    });
});
exports.deleteRoot = deleteRoot;
//@desc         delete admin
//@route        PATCH /api/v1/users/admins/:id
//@access       private(admin, root)
const deleteAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedAdmin = yield User_1.default.deleteOne({ _id: req.params.id, role: enums_1.Roles.ADMIN, company: req.user.company }, { new: true });
    // We need to check if this admin is in the same company
    if (deletedAdmin === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'admin is deleted successfully',
        data: deletedAdmin,
    });
});
exports.deleteAdmin = deleteAdmin;
//@desc         delete employee
//@route        PATCH /api/v1/users/employees/:id
//@access       private(admin, root)
const deleteEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const deletedEmployee = await User.deleteOne({_id: req.params.id, role: Roles.EMPLOYEE, company: req.user!.company}, {new: true});
    const user = req.params.id;
    yield payrol_1.default.deleteMany({ employee: user });
    yield Contract_1.default.deleteOne({ employee: user });
    yield attendenc_model_1.Attendance.deleteMany({ member: user });
    yield blog_model_1.default.deleteMany({ user: user });
    yield blog_model_1.default.updateMany({ user: user }, {
        $pull: {
            'likes.$.user': user,
            comments: { $eq: user }
        }
    });
    yield Request_1.default.deleteMany({ to: user });
    yield Request_1.default.deleteMany({ from: user });
    yield Documents_1.Document.deleteMany({ userId: user });
    yield comment_model_1.default.deleteMany({ user: user });
    yield Request_1.default.deleteMany({ from: user });
    yield task_1.default.deleteMany({ from: user });
    yield notification_model_1.Notification.deleteMany({ employee: user });
    yield task_1.default.updateMany({ to: { $in: user } }, {
        $pull: {
            to: user,
        },
    });
    yield Break_1.Break.updateMany({ users: { $in: req.user } }, {
        $pull: {
            users: user,
        },
    });
    yield OverTime_1.Overtime.updateMany({ users: { $in: req.user } }, {
        $pull: {
            users: user,
        },
    });
    const deletedEmployee = yield User_1.default.deleteOne({ _id: req.params.id }, { new: true });
    if (deletedEmployee === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.status(204).json({
        success: true,
        message: 'employee is deleted successfully',
        data: deletedEmployee,
    });
});
exports.deleteEmployee = deleteEmployee;
