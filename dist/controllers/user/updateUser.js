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
exports.updateUser = exports.updateEmployee = exports.updateAdmin = exports.updateRoot = exports.updateSuperAdmin = void 0;
const User_1 = __importDefault(require("../../models/User"));
const enums_1 = require("../../types/enums");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//@desc         update superadmin
//@route        UPDATE /api/v1/users/superadmins/:id
//@access       private(super admins)
const updateSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedSuperAdmin = yield User_1.default.updateOne({ _id: req.params.id, role: enums_1.Roles.SUPER_ADMIN }, req.body, { new: true });
    if (updatedSuperAdmin === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.json({
        success: true,
        message: 'super admin is updated successfully',
        data: updatedSuperAdmin,
    });
});
exports.updateSuperAdmin = updateSuperAdmin;
//@desc         update root
//@route        UPDATE /api/v1/users/roots/:id
//@access       private(super admins)
const updateRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedRoot = yield User_1.default.updateOne({ _id: req.params.id, role: enums_1.Roles.ROOT }, req.body, { new: true });
    if (updatedRoot === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.json({
        success: true,
        message: 'super admin is updated successfully',
        data: updatedRoot,
    });
});
exports.updateRoot = updateRoot;
//@desc         Update admin
//@route        UPDATE /api/v1/users/admins/:id
//@access       private(admin, root)
const updateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedAdmin = yield User_1.default.updateOne({ _id: req.params.id, role: enums_1.Roles.ADMIN, company: req.user.company }, req.body, { new: true });
    // We need to check if this admin is in the same company
    if (updatedAdmin === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.json({
        success: true,
        message: 'employee is updated successfully',
        data: updatedAdmin,
    });
});
exports.updateAdmin = updateAdmin;
//@desc         get all employees
//@route        GET /api/v1/users/employees/:id
//@access       private(admin, root)
const updateEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedEmployee = yield User_1.default.updateOne({ _id: req.params.id, role: enums_1.Roles.EMPLOYEE }, req.body, { new: true });
    if (updatedEmployee === null)
        return res.status(400).send({
            success: false,
            message: 'user not found',
        });
    res.json({
        success: true,
        message: 'employee is updated successfully',
        data: updatedEmployee,
    });
});
exports.updateEmployee = updateEmployee;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userV = yield User_1.default.findOne({ _id: req.params.id ? req.params.id : (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!userV)
        return res
            .status(400)
            .send({ error_en: 'Invaild User', error_ar: 'مستخدم غير صحيح' });
    if (req.body.password) {
        req.body.password = bcryptjs_1.default.hashSync(req.body.password, 10);
    }
    console.log('updateUser');
    // req?.user?.role !== 'root' ? req.body.role : (req.body.role = userV.role)
    if (req.body.role) {
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) == 'employee') {
            req.body.role = 'employee';
        }
        else if (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role) == 'admin') {
            req.body.role = req.body.role != 'root' ? req.body.role : 'admin';
        }
    }
    const user = yield User_1.default.findByIdAndUpdate(req.params.userId, Object.assign({}, req.body), { new: true });
    if (!user) {
        return res.status(400).send({
            error_en: 'Cant Update User ',
            error_ar: 'غير قادر على تحديث المستخدم',
        });
    }
    res.status(200).send({
        success_en: 'User Updated Successfully ',
        success_ar: 'تم تحديث المستخدم بنجاح',
        user,
    });
});
exports.updateUser = updateUser;
