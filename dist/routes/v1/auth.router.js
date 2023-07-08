"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createUser_1 = require("./../../controllers/user/createUser");
const validate_1 = require("./../../middlewares/validate");
const express_1 = require("express");
const login_1 = __importDefault(require("../../controllers/auth/login"));
const userValidator_1 = require("../../validators/userValidator");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', login_1.default);
authRouter.post('/register', (0, validate_1.validator)(userValidator_1.validateUserPost, 'post'), createUser_1.createUser);
exports.default = authRouter;
