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
const User_1 = __importDefault(require("../../models/User"));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: enteredPassword } = req.body;
    if (!(email && enteredPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter email and password.'
        });
    }
    const user = yield User_1.default.findOne({ email });
    console.log(user);
    if (!(user !== null && (yield user.isPasswordsMatched(enteredPassword)))) {
        return res.status(400).json({
            success: false,
            message: 'email or password are invalid',
        });
    }
    const token = user.createToken();
    res.status(201).header('Authorization', token).json({
        success: true,
        message: 'you are logined successfully',
        data: user,
        token: token
    });
});
exports.default = login;
