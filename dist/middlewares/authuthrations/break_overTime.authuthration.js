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
exports.AuthuthrationBreakOver = void 0;
const Break_1 = require("./../../models/Break");
const OverTime_1 = require("./../../models/OverTime");
const Shift_1 = require("./../../models/Shift");
const User_1 = __importDefault(require("../../models/User"));
const Company_1 = require("../../models/Company");
const AuthuthrationBreakOver = (type, mode) => function (req, res, next) {
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
        if (type === 'break' || type === 'overtime') {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
                error_ar: ` لا يمكنك (إضافة أو تحديث أو الحصول على أو حذف) أي  في الشركة لأنك لست صاحب الشركة`,
            };
            const { shift, id } = req.params;
            console.log(shift);
            const overtiome = id && (yield OverTime_1.Overtime.findOne({ _id: id }));
            const breaks = id && (yield Break_1.Break.findOne({ _id: id }));
            console.log(req.body.shift);
            if (!breaks && !overtiome && id)
                return res.status(400).send({ error_en: 'Invaild OverTime Or Break!!' });
            const shiftValid = overtiome ? yield Shift_1.Shift.findOne({
                _id: shift ? shift : req.body.shift ? req.body.shift : overtiome.shift,
            }).populate('branch') : yield Shift_1.Shift.findOne({
                _id: shift ? shift : req.body.shift ? req.body.shift : breaks.shift,
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
        next();
    });
};
exports.AuthuthrationBreakOver = AuthuthrationBreakOver;
