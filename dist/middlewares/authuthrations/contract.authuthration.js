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
exports.AuthuthrationContract = void 0;
const Department_1 = require("./../../models/Department");
const Branch_1 = require("./../../models/Branch");
const User_1 = __importDefault(require("../../models/User"));
const Company_1 = require("../../models/Company");
const Contract_1 = __importDefault(require("../../models/Contract"));
const AuthuthrationContract = (type, mode) => function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        //Obtaining user to know who is owner
        const user = yield User_1.default.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        let owner;
        // If the user is a root, he gets his companies
        if (user.role === 'root') {
            owner = user._id;
        }
        // If the user is an admin, he gets his owner and gets his companies
        else if (user.role === 'admin') {
            const company = yield Company_1.Company.findOne({ _id: user.company });
            owner = company.owner;
        }
        // If the user is an employee, he gets his owner and gets his companies
        else if (user.role === 'employee') {
            const company = yield Company_1.Company.findOne({ _id: user.company });
            owner = company.owner;
        }
        //Obtaining companies owner
        const companiesId = (yield Company_1.Company.find({ owner: owner })).map((company) => company._id.toString());
        //Obtaining a branch to compare the company's branch between the companies that own to owner
        const branch = yield Branch_1.Branch.findOne({
            _id: req.body.branch
                ? req.body.branch
                : req.params.branch
                    ? req.params.branch
                    : req.query.branch,
        });
        const departmentsId = branch &&
            (yield Department_1.Department.find({ branch: branch._id })).map((department) => department._id.toString());
        //Data of body
        let { department } = req.body;
        if (type === 'contract') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in this( branch , comapny , department) because you are not the owner of the company has this (branch , department )`,
            };
            const employee = yield User_1.default.findOne({
                _id: req.body.employee,
                role: ['employee', "admin"],
            }).populate('branch');
            if (mode === 'post' || mode === 'put') {
                if (!employee)
                    return res.status(400).send({ error_en: 'Invalid Emploeey' });
                if (!companiesId.includes(employee.branch.company.toString()) ||
                    !companiesId.includes(branch.company.toString()) ||
                    !departmentsId.includes(department))
                    return res.status(401).send(error);
                if (employee.branch._id.toString() !== branch._id.toString() ||
                    employee.department.toString() !== department)
                    return res.status(400).send({
                        error_en: 'the employee is not found with the given branch or is not found with the given department',
                        error_ar: 'لم يتم العثور على الموظف في الفرع المحدد أو لم يتم العثور عليه في القسم المحدد',
                    });
            }
            else if (mode === 'get') {
                const { department } = req.query;
                if ((req.params.company && !companiesId.includes(req.params.company)) ||
                    (branch && !(companiesId === null || companiesId === void 0 ? void 0 : companiesId.includes((_b = branch === null || branch === void 0 ? void 0 : branch.company) === null || _b === void 0 ? void 0 : _b.toString()))) ||
                    (department && !(departmentsId === null || departmentsId === void 0 ? void 0 : departmentsId.includes(department))))
                    return res.status(401).send(error);
            }
            else if (mode === 'delete') {
                console.log('befor Zanykaa; ');
                const contract = yield Contract_1.default.findById(req.params.id).populate('branch');
                if (!contract)
                    return res.status(400).send({ error_en: 'Invalid Contract' });
                if (!companiesId.includes(contract.branch.company.toString()))
                    return res.status(401).send(error);
            }
        }
        next();
    });
};
exports.AuthuthrationContract = AuthuthrationContract;
