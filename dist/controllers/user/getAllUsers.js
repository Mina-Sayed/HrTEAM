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
exports.getAllEmpsBasedOnRole = exports.getMe = exports.getRootAndAdmin = exports.getAllEmployeesInShift = exports.getAllEmployeesInTheCompanyWithBranchAndDepartment = exports.getAllEmployeesInDepartment = exports.getAllEmployeesInBranch = exports.getAllEmployeesInComapny = exports.getAllEmployees = exports.getAllAdminsInDepartment = exports.getAllAdminsInBranch = exports.getAllAdminsInCompany = exports.getAllAdmins = exports.getAllRoots = exports.getAllSuperAdmins = void 0;
const enums_1 = require("./../../types/enums");
const Company_1 = require("../../models/Company");
const User_1 = __importDefault(require("../../models/User"));
//@desc         get all superadmins
//@route        GET /api/v1/users/superadmins
//@access       private(super admins)
const getAllSuperAdmins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allSupervisors = yield User_1.default.find({ role: 'super admin' });
    return res.send({
        success: true,
        data: allSupervisors,
        message: 'Users are fetched successfully',
    });
});
exports.getAllSuperAdmins = getAllSuperAdmins;
//@desc         get all roots
//@route        GET /api/v1/users/roots
//@access       private(super admins)
const getAllRoots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allRoots = yield User_1.default.find({ role: 'root' });
    return res.send({
        success: true,
        data: allRoots,
        message: 'Users are fetched successfully',
    });
});
exports.getAllRoots = getAllRoots;
//@desc         get all admins
//@route        GET /api/v1/users/admin
//@access       private(admin, root, employee)
const getAllAdmins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let owner;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'root') {
        owner = req.user._id;
    }
    else {
        return res
            .status(401)
            .send({ erorr_en: 'You are not owner to access on this ' });
    }
    const companies = yield Company_1.Company.find({ owner: owner });
    for (let index = 0; index < companies.length; index++) {
        const element = companies[index];
        const towIndex = companies.length - (companies.length - index) + 1;
        const users = yield User_1.default.find({ comapny: element._id, role: 'admin' });
        if (!users[0])
            return res.status(404).send({ error_en: "You don't have admins yet .." });
        if (companies.length - 1 === index) {
            return res.send({
                success: true,
                data: users,
                message: 'Users are fetched successfully',
            });
        }
    }
    // const allEmployees = await User.find({ role: 'employee', company: req.user!.company });
});
exports.getAllAdmins = getAllAdmins;
//@desc         get all admins in company
//@route        GET /api/v1/users/admins/:company
//@access       private(admin, root)
const getAllAdminsInCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAdmins = yield User_1.default.find({
        role: 'admin',
        company: req.params.company,
    });
    if (!allAdmins[0])
        return res
            .status(404)
            .send({ error_en: "You don't have admins yet on the company.." });
    return res.send({
        success: true,
        data: allAdmins,
        message: 'Users are fetched successfully',
    });
});
exports.getAllAdminsInCompany = getAllAdminsInCompany;
//@desc         get all admins in branch
//@route        GET /api/v1/users/admins/:branch
//@access       private(admin, root)
const getAllAdminsInBranch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAdmins = yield User_1.default.find({
        role: 'admin',
        company: req.params.branch,
    });
    if (!allAdmins[0])
        return res
            .status(404)
            .send({ error_en: "You don't have admins yet on the branch.." });
    return res.send({
        success: true,
        data: allAdmins,
        message: 'Users are fetched successfully',
    });
});
exports.getAllAdminsInBranch = getAllAdminsInBranch;
//@desc         get all admins in department
//@route        GET /api/v1/users/admins/:department
//@access       private(admin, root)
const getAllAdminsInDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAdmins = yield User_1.default.find({
        role: 'admin',
        company: req.params.department,
    });
    if (!allAdmins[0])
        return res
            .status(404)
            .send({ error_en: "You don't have admins yet on the department.." });
    return res.send({
        success: true,
        data: allAdmins,
        message: 'Users are fetched successfully',
    });
});
exports.getAllAdminsInDepartment = getAllAdminsInDepartment;
//@desc         get all employees
//@route        GET /api/v1/users/employyes
//@access       private(admin, root, employee)
const getAllEmployees = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    let owner;
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin') {
        const comapny = yield Company_1.Company.findOne({ owner: req.user._id });
        owner = comapny === null || comapny === void 0 ? void 0 : comapny.owner;
    }
    else if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === 'root') {
        owner = req.user._id;
    }
    const companies = (yield Company_1.Company.find({ owner: owner })).map((company) => company._id.toString());
    const users = yield User_1.default.find({
        company: companies,
        role: { $in: [enums_1.Roles.EMPLOYEE, enums_1.Roles.ADMIN] },
    });
    if (!users[0])
        return res.status(404).send({ error_en: "You don't have employees yet .." });
    return res.send({
        success: true,
        data: users,
        message: 'Users are fetched successfully',
    });
    // const allEmployees = await User.find({ role: 'employee', company: req.user!.company });
});
exports.getAllEmployees = getAllEmployees;
//@desc         get all employees on company
//@route        GET /api/v1/users/employye/company/:company
//@access       private(admin, root, employee)
const getAllEmployeesInComapny = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    console.log('dsadsadsad');
    let allEmployees;
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) === enums_1.Roles.EMPLOYEE) {
        allEmployees = yield User_1.default.find({
            role: ['employee', 'admin'],
            branch: req.user.branch,
        }).populate('department branch shift company');
    }
    else {
        allEmployees = yield User_1.default.find({
            role: ['employee', 'admin'],
            company: req.params.company,
        }).populate('department branch shift company');
        console.log(allEmployees);
    }
    if (!allEmployees[0])
        return res
            .status(404)
            .send({ error_en: "You don't have employees yet on the company.." });
    return res.send({
        success: true,
        data: allEmployees,
        message: 'Users are fetched successfully',
    });
});
exports.getAllEmployeesInComapny = getAllEmployeesInComapny;
//@desc         get all employees on branch
//@route        GET /api/v1/users/employye/branch/:branch
//@access       private(admin, root, employee)
const getAllEmployeesInBranch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allEmployees = yield User_1.default.find({
        role: ['employee', 'admin'],
        branch: req.params.branch,
    });
    return res.send({
        success: true,
        data: allEmployees,
        message: 'Users are fetched successfully',
    });
});
exports.getAllEmployeesInBranch = getAllEmployeesInBranch;
//@desc         get all employees on branch
//@route        GET /api/v1/users/employye/department/:department
//@access       private(admin, root, employee)
const getAllEmployeesInDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allEmployees = yield User_1.default.find({
        role: ['employee', 'admin'],
        department: req.params.department,
    });
    return res.send({
        success: true,
        data: allEmployees,
        message: 'Users are fetched successfully',
    });
});
exports.getAllEmployeesInDepartment = getAllEmployeesInDepartment;
//DESC get All The Employees
//Route GET /api/v1/users/employee/?branch=id&department=id
const getAllEmployeesInTheCompanyWithBranchAndDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l;
    let empsAtEmp;
    if (((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.role) == 'employee') {
        console.log('reqBranch: ', (_f = req.user) === null || _f === void 0 ? void 0 : _f.branch, (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g.department, (_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id);
        empsAtEmp = yield User_1.default.find({
            _id: (_j = req === null || req === void 0 ? void 0 : req.user) === null || _j === void 0 ? void 0 : _j._id,
            branch: (_k = req === null || req === void 0 ? void 0 : req.user) === null || _k === void 0 ? void 0 : _k.branch,
            department: (_l = req === null || req === void 0 ? void 0 : req.user) === null || _l === void 0 ? void 0 : _l.department,
        });
    }
    else {
        let filterationOption = req.query
            ? Object.assign(Object.assign({}, req.query), { company: req.params.companyId }) : { company: req.params.companyId };
        empsAtEmp = yield User_1.default.find(filterationOption);
        if (!empsAtEmp[0]) {
            return res
                .status(400)
                .send({
                error_en: 'Employees Are Not Found',
                error_ar: 'لم يتم العثور على الموظفين',
            });
        }
    }
    res
        .status(200)
        .send({
        success_en: 'Employees Are Fetched Successfully',
        success_ar: 'تم جلب الموظفين بنجاح',
        users: empsAtEmp,
    });
});
exports.getAllEmployeesInTheCompanyWithBranchAndDepartment = getAllEmployeesInTheCompanyWithBranchAndDepartment;
//@desc         get all employees on branch
//@route        GET /api/v1/users/employye/department/:department
//@access       private(admin, root, employee)
const getAllEmployeesInShift = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allEmployees = yield User_1.default.find({
        role: ['employee', 'admin'],
        shift: req.params.shift,
    });
    if (!allEmployees[0])
        return res
            .status(404)
            .send({ error_en: "You don't have employees yet on the shift.." });
    return res.send({
        success: true,
        data: allEmployees,
        message: 'Users are fetched successfully',
    });
});
exports.getAllEmployeesInShift = getAllEmployeesInShift;
//@desc         get all admins and owner
//@route        GET /api/v1/users/employye/infoComapny
//@access       private(admin, root, employee)
const getRootAndAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    const user = yield User_1.default.find({ role: 'employee', _id: (_m = req.user) === null || _m === void 0 ? void 0 : _m._id });
    if (!user)
        return res.status(404).send({ error_en: 'Invalid User' });
    const company = yield Company_1.Company.findOne({ _id: user.company })
        .populate('owner users')
        .sort('createdAt');
    const getAdmins = yield User_1.default.find({ role: 'admin', comapny: company._id });
    return res.send({
        success: true,
        data: { admins: getAdmins, owner: company.owner },
        message: 'Users are fetched successfully',
    });
});
exports.getRootAndAdmin = getRootAndAdmin;
//@desc         get me
//@route        GET /api/v1/users/employye/me
//@access       private(admin, root, employee)
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    const user = yield User_1.default.find({ _id: (_o = req.user) === null || _o === void 0 ? void 0 : _o._id });
    if (!user)
        return res.status(404).send({ error_en: 'Invalid User' });
    return res.send({
        success: true,
        data: user,
        message: 'Users are fetched successfully',
    });
});
exports.getMe = getMe;
// get all employees based on the role
const getAllEmpsBasedOnRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q, _r, _s, _t, _u;
    let emps = [];
    if (((_p = req.user) === null || _p === void 0 ? void 0 : _p.role) == 'root') {
        // get all the companies
        const comps = yield Company_1.Company.find({ owner: (_q = req.user) === null || _q === void 0 ? void 0 : _q._id });
        if (comps[0]) {
            emps = yield User_1.default.find({ company: { $in: [...comps] } }).populate('department branch shift company');
        }
    }
    else {
        let roles = ((_r = req.user) === null || _r === void 0 ? void 0 : _r.role) == 'admin'
            ? [enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE]
            : [enums_1.Roles.EMPLOYEE];
        let filter = ((_s = req.user) === null || _s === void 0 ? void 0 : _s.role) === enums_1.Roles.ADMIN
            ? {
                company: (_t = req.user) === null || _t === void 0 ? void 0 : _t.company,
                role: { $in: [...roles] },
            }
            : { branch: (_u = req.user) === null || _u === void 0 ? void 0 : _u.branch, role: { $in: [...roles] } };
        emps = yield User_1.default.find(filter).populate('department branch shift company');
    }
    if (!emps[0]) {
        return res
            .status(400)
            .send({
            error_en: 'Employees Are Not Found',
            error_ar: 'لم يتم العثور على الموظفين',
        });
    }
    res
        .status(200)
        .send({
        success_en: 'Employees Are Fetched Successfully ',
        success_ar: 'يتم جلب الموظفين بنجاح',
        data: emps,
    });
});
exports.getAllEmpsBasedOnRole = getAllEmpsBasedOnRole;
