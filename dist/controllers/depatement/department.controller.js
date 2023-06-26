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
exports.delteDepartment = exports.getDepartment = exports.getAllDepartment = exports.updateDepartment = exports.addDepartment = void 0;
const enums_1 = require("./../../types/enums");
const Department_1 = require("../../models/Department");
const User_1 = __importDefault(require("../../models/User"));
const payrol_1 = __importDefault(require("../../models/payrol"));
const Contract_1 = __importDefault(require("../../models/Contract"));
//@desc         create a Department
//@route        POST /api/v1/department
//@access       private(root)
const addDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, branch } = req.body;
    // IV:must the name department be unique
    const uniqueDepartment = yield Department_1.Department.findOne({
        branch: branch,
        name: name,
    });
    if (uniqueDepartment)
        return res
            .status(400)
            .send({ error_en: 'The department with the given NAME used befor' });
    const department = new Department_1.Department({
        name: name,
        branch: branch,
    });
    department.save();
    res.send({
        success: true,
        data: department,
        message_en: 'Department created successfully',
    });
});
exports.addDepartment = addDepartment;
//@desc         update a Department
//@route        PUT /api/v1/department/:branch/:name
//@access       private(root)
const updateDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    console.log(req.params.branch);
    console.log(req.params.id);
    //II:chake the department found with company
    const department = yield Department_1.Department.findOne({
        branch: req.params.branch,
        _id: req.params.id,
    });
    if (!department)
        return res.status(400).send({ error_en: 'Invaild departement!!' });
    //III:must the name depatment be unique
    const uniqueDepartment = yield Department_1.Department.findOne({
        _id: { $ne: req.params.id },
        branch: req.params.branch,
        name: name,
    });
    if (uniqueDepartment)
        return res
            .status(400)
            .send({ error_en: 'The department with the given name used befor ' });
    yield Department_1.Department.updateOne({ _id: req.params.id, branch: req.params.branch }, {
        $set: {
            name: name,
        },
    });
    const newD = yield Department_1.Department.findById(req.params.id);
    res.send({
        success: true,
        data: newD,
        message_en: 'Department updated successfully',
    });
});
exports.updateDepartment = updateDepartment;
//@desc         get all Departments
//@route        GET /api/v1/department/:branch
//@access       private(root)
//: a7a ya abdo
// : aya ya abdo tany Department.find({department})
//CHECK ROLE OF THE USER LOGED IN IF EMPLOYEE RETURN THE DEPARTMENT THAT HE WORKS AT ELESE ERETURN ALL
const getAllDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let departments;
    if (enums_1.Roles.EMPLOYEE === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
        departments = yield Department_1.Department.find({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.department });
        // console.log('departments: ', departments)
    }
    else
        departments = yield Department_1.Department.find({ branch: req.params.branch });
    res.send({
        success: true,
        data: departments,
        message_en: 'Departments are fetched successfully',
    });
});
exports.getAllDepartment = getAllDepartment;
//@desc         get a Department
//@route        GET /api/v1/department/:branch/:name
//@access       private(root)
const getDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //II:chake the departmnet found with company
    const department = yield Department_1.Department.findOne({
        branch: req.params.branch,
        _id: req.params.id,
    });
    if (!department)
        return res.status(400).send({ error_en: 'Invaild department!!' });
    res.send({
        success: true,
        data: department,
        message_en: 'Department is fetched successfully',
    });
});
exports.getDepartment = getDepartment;
//@desc         Delete a Department
//@route        DELETE /api/v1/department/:branch/:name
//@access       private(root)
// a7a ya abdo :: where the hell is the fucking delete for the department 
const delteDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield Department_1.Department.findOne({
        branch: req.params.branch,
        _id: req.params.id,
    });
    if (!department)
        return res.status(400).send({ error_en: 'Invaild departement!!' });
    else {
        yield Department_1.Department.findByIdAndDelete(department === null || department === void 0 ? void 0 : department._id);
    }
    yield User_1.default.updateMany({
        department: req.params.id,
    }, {
        $set: {
            department: null,
        },
    });
    yield Contract_1.default.updateMany({
        department: req.params.id,
    }, {
        $set: {
            department: null,
        },
    });
    yield payrol_1.default.deleteMany({
        department: req.params.id,
    });
    res.send({
        success: true,
        message_en: 'Department  deleted successfully',
    });
});
exports.delteDepartment = delteDepartment;
