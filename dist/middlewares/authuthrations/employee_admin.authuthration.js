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
exports.AuthuthrationAdminEmployee = void 0;
const Shift_1 = require("./../../models/Shift");
const Department_1 = require("./../../models/Department");
const Branch_1 = require("./../../models/Branch");
const User_1 = __importDefault(require("../../models/User"));
const Company_1 = require("../../models/Company");
const AuthuthrationAdminEmployee = (type, mode) => function (req, res, next) {
    var _a;
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
        let { department, company, shift } = req.body;
        if (type === 'employee' || type === 'admin') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in this( branch , comapny , department) because you are not the owner of the company has this (branch , department )`,
            };
            const shift = yield Shift_1.Shift.findById(req.body.shift).populate('branch');
            if (mode === 'post') {
                if (!shift)
                    return res
                        .status(400)
                        .send({ error_en: 'Please check you have add shift for employee' });
                if (!companiesId.includes(company) ||
                    !companiesId.includes(branch.company.toString()) ||
                    !companiesId.includes(shift.branch.company.toString()) ||
                    !departmentsId.includes(department))
                    return res.status(401).send(error);
            }
            else if (mode === 'delete' || mode === 'put') {
                const user = yield User_1.default.findOne({ _id: req.params.id });
                const { company, department } = req.body;
                if (!companiesId.includes(user.company.toString()) ||
                    (company && !companiesId.includes(company)) ||
                    (branch && !companiesId.includes(branch.company.toString())) ||
                    (shift && !companiesId.includes(shift.branch.company.toString())) ||
                    (department && !departmentsId.includes(department)))
                    return res.status(401).send(error);
            }
            else if (mode === 'get') {
                const { company, department, shift } = req.params;
                const shiftV = shift && (yield Shift_1.Shift.findById(shift).populate('branch'));
                const departmentV = department &&
                    (yield Department_1.Department.findOne({
                        _id: department,
                    }).populate('branch'));
                if (department && !departmentV)
                    return res.status(400).send({ error_en: 'Invalid Department !!' });
                if (shift && !shiftV)
                    return res.status(400).send({ error_en: 'Invalid Shift !!' });
                if (company && !companiesId.includes(company))
                    return res.status(401).send(error);
                else if (branch && !companiesId.includes(branch.company.toString()))
                    return res.status(401).send(error);
                else if (department &&
                    departmentV &&
                    !companiesId.includes(departmentV.branch.company.toString()))
                    return res.status(401).send(error);
                else if (shift &&
                    shiftV &&
                    !companiesId.includes(shiftV.branch.company.toString()))
                    return res.status(401).send(error);
            }
        }
        next();
    });
};
exports.AuthuthrationAdminEmployee = AuthuthrationAdminEmployee;
