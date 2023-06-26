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
exports.AuthenticationMiddleware = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthenticationMiddleware = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Get Token From Header Of Request And Check If Token Is Exist
            const token = req.header("Authentication");
            if (!token)
                return res.status(401).send({ error_en: "Access Denied!!" });
            //decoded Token And Find In Mongoo db By id Then CHeck If user Exist
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            const user = yield User_1.default.findById(decoded._id);
            if (!user)
                return res.send("Invalid Token");
            // Set Current User To locals
            req.user = user;
            // call next Middleware
            return next();
        }
        catch (ex) {
            return res.status(400).send("");
        }
    });
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
