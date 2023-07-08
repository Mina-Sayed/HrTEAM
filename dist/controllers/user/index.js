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
exports.getUser = exports.getMe = void 0;
const User_1 = __importDefault(require("../../models/User"));
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const employee = yield User_1.default.findOne({ _id: userId }).select('-password');
    if (!employee)
        return res
            .status(404)
            .send({ success: false, message: "user with this id not found" });
    return res.send({
        success: true,
        data: employee,
    });
});
exports.getMe = getMe;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const employee = yield User_1.default.findOne({ _id: userId }).select('-password');
    if (!employee)
        return res
            .status(404)
            .send({ success: false, message: "user with this id not found" });
    return res.send({
        success: true,
        data: employee,
    });
});
exports.getUser = getUser;
