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
exports.createUser = exports.createEmployee = exports.createAdmin = exports.createRoot = exports.createSuperAdmin = void 0;
const User_1 = __importDefault(require("../../models/User"));
const enums_1 = require("../../types/enums");
const Subscription_1 = __importDefault(require("../../models/Subscription"));
//@desc         create superadmin
//@route        POST /api/v1/users/superadmins
//@access       private(super admins)
const createSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield User_1.default.create(Object.assign(Object.assign({}, req.body), { role: enums_1.Roles.SUPER_ADMIN }));
    const token = createdUser.createToken();
    res.status(201).header('Authorization', token).json({
        success: true,
        message: 'super admin is created successfully',
        data: createdUser,
    });
});
exports.createSuperAdmin = createSuperAdmin;
//@desc         create root
//@route        POST /api/v1/users/roots
//@access       private(super admins)
const createRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = new User_1.default(Object.assign(Object.assign({}, req.body), { role: enums_1.Roles.ROOT }));
    const userSubscriptions = new Subscription_1.default({
        subscriber: createdUser._id,
        package: req.body.package,
    });
    if (!req.body.package)
        return res
            .status(400)
            .send({ error_en: 'The package requierd for create root' });
    // Here we need to check if a root was already created or not
    const token = createdUser.createToken();
    createdUser.save();
    userSubscriptions.save();
    res.status(201).header('Authorization', token).json({
        success: true,
        message: 'root  created successfully',
        data: { createdUser, userSubscriptions },
    });
});
exports.createRoot = createRoot;
//@desc         get all admins
//@route        GET /api/v1/users/admins
//@access       private(admin, root)
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield User_1.default.create(Object.assign(Object.assign({}, req.body), { role: enums_1.Roles.ADMIN }));
    return res.status(201).send({
        success: true,
        data: admin,
        message: 'admin is created successfully',
    });
});
exports.createAdmin = createAdmin;
//@desc         get all employees
//@route        GET /api/v1/users/employees
//@access       private(admin, root)
const createEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let employee;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === enums_1.Roles.ROOT) {
        employee = new User_1.default(Object.assign({}, req.body));
    }
    else {
        employee = new User_1.default(Object.assign(Object.assign({}, req.body), { role: enums_1.Roles.EMPLOYEE }));
    }
    if (!req.body.shift)
        return res.status(400).send({ error_en: 'pleas enter shift for employee' });
    //departments
    //branches
    //companies
    employee.save();
    return res.status(201).send({
        success: true,
        data: employee,
        message: 'employee is created successfully',
    });
});
exports.createEmployee = createEmployee;
//@desc         URL REGISTER EMPLOYEES
//@route        GET /api/v1/users/employees
//@access       private(admin, root)
// export const RegisterEmployee = async (req: Request, res: Response) => {
//     const Id = req.params.register
// }
//@desc         REGISTER
//@route        POST /api/v1/users/register
//@access       public
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.default(Object.assign(Object.assign({}, req.body), { role: enums_1.Roles.USER }));
    user.save();
    return res.status(201).send({
        success: true,
        data: user,
        message: 'SignUp is successfully',
    });
});
exports.createUser = createUser;
