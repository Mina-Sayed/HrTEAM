"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongodb_1 = require("mongodb");
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.Schema({
    fullName_ar: String,
    fullName_en: String,
    userName_ar: String,
    userName_en: String,
    nationalId: String,
    position: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "user"
    },
    residencyExpiration: Date,
    nationality: String,
    phone: String,
    phone2: String,
    address: {
        type: String,
        default: ''
    },
    city: String,
    birthDate: Date,
    maritalStatus: String,
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Departments'
    },
    branch: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branches'
    },
    company: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'company'
    },
    shift: {
        type: mongodb_1.ObjectId,
        ref: "shift"
    },
    image: {
        type: String,
        default: 'avatar.jpg'
    }
}, { timestamps: true });
// Hash password
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hash;
        next();
    });
});
//   Check if passwords are mathced
UserSchema.methods.isPasswordsMatched = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
UserSchema.methods.createToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id, email: this.email, role: this.role }, process.env.JWT_KEY);
};
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
