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
exports.AuthuthrationRequest = void 0;
const enums_1 = require("./../../types/enums");
const User_1 = __importDefault(require("../../models/User"));
const Company_1 = require("../../models/Company");
const Request_1 = __importDefault(require("../../models/Request"));
const Department_1 = require("../../models/Department");
const Branch_1 = require("../../models/Branch");
const AuthuthrationRequest = (type, mode) => function (req, res, next) {
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
        const branchReq = yield Branch_1.Branch.findOne({
            _id: req.body.branch
                ? req.body.branch
                : req.params.branch
                    ? req.params.branch
                    : req.query.branch,
        });
        const departmentsId = branchReq &&
            (yield Department_1.Department.find({ branch: branchReq._id })).map((department) => department._id.toString());
        //Data of body
        if (type === 'request') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
                error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
            };
            const { to, ids } = req.body;
            if (mode === 'post') {
                const company = yield Company_1.Company.findOne({ _id: to });
                const branch = yield Branch_1.Branch.findOne({ _id: to });
                const department = yield Department_1.Department.findOne({ _id: to }).populate('branch');
                const user = yield User_1.default.find({ _id: ids });
                // for company
                if (company && !companiesId.includes(company._id.toString()))
                    return res.status(401).send(error);
                // for branch
                if (branch && !companiesId.includes(branch.company.toString()))
                    return res.status(401).send(error);
                // for department
                if (department &&
                    !companiesId.includes(department.branch.company.toString()))
                    return res.status(401).send(error);
                // for employee
                if (user[0] &&
                    user.some((user) => !companiesId.includes(user.company.toString())))
                    return res.status(401).send(error);
            }
            if (mode === 'get' || mode === 'put') {
                const requste = req.params.id &&
                    (yield Request_1.default.findOne({ _id: req.params.id }).populate('to'));
                // console.log(requste.to);
                // if (requste && !companiesId.includes(requste.from.company.toString()))
                //   return res.status(401).send(error)
            }
            if (mode === 'all') {
                // if (
                //   (req.query.company || req.user?.company) &&
                //   !companiesId.includes(
                //     req.user?.company ? req.user?.company : req.query.company,
                //   )
                // )
                //   return res.status(401).send(error)
                if (user.role === enums_1.Roles.ADMIN || user.role === enums_1.Roles.ROOT) {
                    const { company, department, branch } = req.query;
                    if ((user.company && !companiesId.includes(user.company.toString())) ||
                        (company && !companiesId.includes(company)) ||
                        (branchReq &&
                            !companiesId.includes(branchReq.company.toString())) ||
                        (department && !departmentsId.includes(department)))
                        return res.status(401).send(error);
                }
            }
        }
        next();
    });
};
exports.AuthuthrationRequest = AuthuthrationRequest;
