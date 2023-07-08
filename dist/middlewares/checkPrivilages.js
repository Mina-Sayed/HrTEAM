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
exports.checkCreationPrivilage = exports.checkUpdatePrivilage = void 0;
const enums_1 = require("../types/enums");
const Company_1 = require("../models/Company");
const User_1 = __importDefault(require("../models/User"));
const checkUpdatePrivilage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.params.id;
    const user = yield User_1.default.findById(userId);
    if (user === null)
        return res.status(404).send({
            success: false,
            message: 'user not found'
        });
    // We need to check if root can add employees only to his companies
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === enums_1.Roles.ROOT) {
        const company = yield Company_1.Company.findOne({ owner: req.user._id, _id: user.company });
        if (company === null)
            return res.status(400).send({
                success: false,
                message: "employees can only be accessed in root's companies"
            });
    }
    ;
    if (req.body.company === null)
        return next();
    // We need to check if this employee is in the same company
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === enums_1.Roles.ADMIN && req.user.company !== req.body.company) {
        return res.status(400).send({
            success: false,
            message: 'employees can only be accessed in the same company'
        });
    }
    ;
    next();
});
exports.checkUpdatePrivilage = checkUpdatePrivilage;
const checkCreationPrivilage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    // We need to check if root can add employees only to his companies
    if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === enums_1.Roles.ROOT) {
        const company = yield Company_1.Company.findOne({ owner: req.user._id, _id: req.body.company });
        if (company === null)
            return res.status(400).send({
                success: false,
                message: "employees can only be accessed in root's companies"
            });
    }
    ;
    if (req.body.company === null)
        return next();
    // We need to check if this employee is in the same company
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) === enums_1.Roles.ADMIN && req.user.company !== req.body.company) {
        return res.status(400).send({
            success: false,
            message: 'employees can only be accessed in the same company'
        });
    }
    ;
    next();
});
exports.checkCreationPrivilage = checkCreationPrivilage;
