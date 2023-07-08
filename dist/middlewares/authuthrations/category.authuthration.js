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
exports.AuthuthrationCategory = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Company_1 = require("../../models/Company");
const Category_1 = __importDefault(require("../../models/Category"));
const AuthuthrationCategory = (type, mode) => function (req, res, next) {
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
        //Data of body
        let { company } = req.body;
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
                    const companyId = category.company && category.company.toString();
                    if (!category || !companiesId.includes(companyId))
                        return res.status(401).send(error);
                }
            }
        }
        next();
    });
};
exports.AuthuthrationCategory = AuthuthrationCategory;
