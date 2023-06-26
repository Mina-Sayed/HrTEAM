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
exports.AuthuthrationMiddleware = void 0;
const Shift_1 = require("../models/Shift");
const Company_1 = require("../models/Company");
const Branch_1 = require("../models/Branch");
const User_1 = __importDefault(require("../models/User"));
const Department_1 = require("../models/Department");
const Category_1 = __importDefault(require("../models/Category"));
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const Contract_1 = __importDefault(require("../models/Contract"));
const Request_1 = __importDefault(require("../models/Request"));
const task_1 = __importDefault(require("../models/task"));
const AuthuthrationMiddleware = (type, mode) => function (req, res, next) {
    var _a, _b, _c;
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
            const company = yield Company_1.Company.find({ owner: user._id });
            owner = company.owner;
        }
        // If the user is an employee, he gets his owner and gets his companies
        else if (user.role === 'employee') {
            const company = yield Company_1.Company.find({ owner: user._id });
            owner = company.owner;
        }
        //Obtaining companies owner
        const companies = yield Company_1.Company.find({ owner: owner });
        //Obtaining a branch to compare the company's branch between the companies that own to owner
        let branch;
        branch = yield Branch_1.Branch.findOne({
            _id: req.body.branch ? req.body.branch : req.params.branch,
        });
        //Obtaining IDS companies
        const companiesId = companies.map((co) => {
            return co._id.toString();
        });
        //Obtaining department branch
        const departments = branch
            ? yield Department_1.Department.find({ branch: branch._id })
            : [];
        //Obtaining IDS of departments
        const departmentsId = departments.map((dep) => {
            return dep._id.toString();
        });
        //Data of body
        let { company, department } = req.body;
        if (type === 'company') {
            if (!companies[0] && !req.params.name)
                return res
                    .status(404)
                    .send({ error_en: "You don't have any company for now.." });
        }
        if (type === 'branch') {
            const companyValid = yield Company_1.Company.findOne({
                owner: owner,
                _id: company ? company : req.params.company,
            });
            if (!companyValid)
                return res.status(401).send({
                    error_en: 'You cannot (add or update or get) any branch in this company because you are not the owner of the company',
                });
        }
        if (type === 'departement' || type === 'shift') {
            console.log(branch);
            console.log(companiesId);
            if (req.params.company && !companiesId.includes(req.params.company))
                return res.status(401).send({
                    error_en: `You cannot (add or update or get) any ${type} in this branch because you are not the owner of the company has this branch`,
                });
            if (branch && !companiesId.includes(branch.company.toString()))
                return res.status(401).send({
                    error_en: `You cannot (add or update or get) any ${type} in this branch because you are not the owner of the company has this branch`,
                });
        }
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
                    !companiesId.includes(company) ||
                    !companiesId.includes(branch.company.toString()) ||
                    !companiesId.includes(shift.branch.company.toString()) ||
                    !departmentsId.includes(department))
                    return res.status(401).send(error);
            }
            else if (mode === 'get') {
                const { company, department } = req.params;
                if (company && !companiesId.includes(company))
                    return res.status(401).send(error);
                else if (branch && !companiesId.includes(branch.company.toString()))
                    return res.status(401).send(error);
            }
        }
        if (type === 'contract') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in this( branch , comapny , department) because you are not the owner of the company has this (branch , department )`,
            };
            const employee = yield User_1.default.findOne({
                _id: req.body.employee,
                role: 'employee',
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
                const { department } = req.params;
                if (!companiesId.includes(req.params.company) ||
                    (branch && !companiesId.includes(branch.company.toString())) ||
                    (department && !departmentsId.includes(department)))
                    return res.status(401).send(error);
            }
            else if (mode === 'delete') {
                const contract = yield Contract_1.default.findById(req.params.id).populate('brnach');
                if (!contract)
                    return res.status(400).send({ error_en: 'Invalid Contract' });
                if (!companiesId.includes(contract.branch.company.toString()))
                    return res.status(401).send(error);
            }
        }
        if (type === 'break' || type === 'overtime') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
                error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
            };
            const { shift } = req.params;
            const shiftValid = yield Shift_1.Shift.findOne({
                _id: shift ? shift : req.body.shift,
            }).populate('branch');
            if (!shiftValid)
                return res.status(400).send({ error_en: 'Invalid Shift' });
            if (!companiesId.includes(shiftValid.branch.company.toString()))
                return res.status(401).send(error);
            if (req.body.userId) {
                const employee = yield User_1.default.findOne({
                    _id: req.body.userId,
                    role: 'employee',
                }).populate('branch');
                if (!employee)
                    return res.status(400).send({ error_en: 'Invalid Emploeey' });
                if (!companiesId.includes(employee.branch.company.toString()))
                    return res.status(401).send(error);
                if (!employee.shift ||
                    shiftValid._id.toString() !== employee.shift.toString())
                    return res.status(401).send({
                        error_en: `User you are trying to assing to is not found in the shift : ${shiftValid.name} `,
                    });
            }
        }
        if (type === 'category' &&
            (user.role === 'admin' ||
                user.role === 'root' ||
                user.role === 'employee')) {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
            };
            if (mode === 'post') {
                if (!companiesId.includes(company))
                    return res.status(401).send(error);
            }
            else if (mode === 'get' || 'put' || 'delete') {
                const { company } = req.query;
                if (!companiesId.includes((_b = req.user) === null || _b === void 0 ? void 0 : _b.company) &&
                    !company &&
                    !req.params.id)
                    return res.status(401).send(error);
                else if (company && !companiesId.includes(company) && !req.params.id)
                    return res.status(401).send(error);
                else if (req.params.id && !company) {
                    const category = yield Category_1.default.findOne({ _id: req.params.id });
                    const companyId = category.company
                        ? category.company.toString()
                        : null;
                    if (!category || !companiesId.includes(companyId))
                        return res.status(401).send(error);
                }
            }
        }
        else if (type === 'subCategory' &&
            (user.role === 'admin' ||
                user.role === 'root' ||
                user.role === 'employee')) {
            if (req.params.id || req.body.category || req.params.categoryId) {
                const error = {
                    error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
                };
                const subCategories = yield SubCategory_1.default.findOne({
                    _id: req.params.id,
                });
                let category = yield Category_1.default.findOne({
                    _id: subCategories ? subCategories.category : req.body.category,
                });
                category == null
                    ? (category = yield Category_1.default.findOne({ _id: req.params.categoryId }))
                    : category;
                const companyId = category.company ? category.company.toString() : null;
                if (companyId && !companiesId.includes(companyId))
                    return res.status(401).send(error);
            }
        }
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
                console.log(user);
                console.log(companiesId);
                if (user[0] &&
                    user.some((user) => !companiesId.includes(user.company.toString())))
                    return res.status(401).send(error);
            }
            if (mode === 'get' || mode === 'put') {
                const requste = req.params.id &&
                    (yield Request_1.default.findOne({ _id: req.params.id }).populate('from'));
                if (requste && !companiesId.includes(requste.from.company.toString()))
                    return res.status(401).send(error);
            }
        }
        if (type === 'task') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
                error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
            };
            const { to } = req.body;
            if (mode === 'post') {
                // const company = await Company.findOne({ _id: to })
                // const branch = await Branch.findOne({ _id: to })
                // const department: any = await Department.findOne({ _id: to }).populate(
                //   'branch',
                // )
                const user = (yield User_1.default.find({ _id: to })).map((user) => user.company.toString());
                // // for company
                // if (company && !companiesId.includes(company._id.toString()))
                //   return res.status(401).send(error)
                // // for branch
                // if (branch && !companiesId.includes(branch.company.toString()))
                //   return res.status(401).send(error)
                // // for department
                // if (
                //   department &&
                //   !companiesId.includes(department.branch.company.toString())
                // )
                //   return res.status(401).send(error)
                // for employee
                if (user[0] && user.some((user) => !companiesId.includes(user)))
                    return res.status(401).send(error);
            }
            else if (mode === 'all') {
                if (user[0] && !companiesId.includes((_c = req.user) === null || _c === void 0 ? void 0 : _c.company.toString()))
                    return res.status(401).send(error);
            }
            else if (mode === 'get' || mode === 'put' || mode === 'delete') {
                const task = req.params.id &&
                    (yield task_1.default.findOne({ _id: req.params.id }).populate('from'));
                if (task && !companiesId.includes(task.from.company.toString()))
                    return res.status(401).send(error);
            }
        }
        next();
    });
};
exports.AuthuthrationMiddleware = AuthuthrationMiddleware;
