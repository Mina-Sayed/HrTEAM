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
exports.getEmployee = exports.getAdmin = exports.getRoot = exports.getSuperAdmin = void 0;
const User_1 = __importDefault(require("../../models/User"));
//@desc         get superadmin by id
//@route        GET /api/v1/users/superadmins/:id
//@access       private(super admins)
const getSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const superAdmin = yield User_1.default.findById(userId);
    if (!superAdmin)
        return res.status(404).send({ success: false, message: 'user with this id is not found' });
    return res.send({
        success: true,
        data: superAdmin,
    });
});
exports.getSuperAdmin = getSuperAdmin;
//@desc         get root by id
//@route        GET /api/v1/users/roots/:id
//@access       private(super admins)
const getRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const root = yield User_1.default.findById(userId);
    if (!root)
        return res.status(404).send({ success: false, message: 'user with this id is not found' });
    return res.send({
        success: true,
        data: root,
    });
});
exports.getRoot = getRoot;
//@desc         get all admins
//@route        GET /api/v1/users/admins
//@access       private(admin, root)
const getAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const admin = yield User_1.default.findOne({ _id: userId, company: req.user.company });
    if (!admin)
        return res.status(404).send({ success: false, message: 'user with this id not found' });
    return res.send({
        success: true,
        data: admin,
    });
});
exports.getAdmin = getAdmin;
//@desc         get all employees
//@route        GET /api/v1/users/employees
//@access       private(admin, root, employee)
const getEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log(userId, req.user, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    // const employee = await User.findOne({_id: userId, company: req.user!.company});
    const employee = yield User_1.default.findOne({ _id: userId });
    console.log(employee, req.user, "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
    if (!employee)
        return res.status(404).send({ success: false, message: 'user with this id not found' });
    return res.send({
        success: true,
        data: employee,
    });
});
exports.getEmployee = getEmployee;
