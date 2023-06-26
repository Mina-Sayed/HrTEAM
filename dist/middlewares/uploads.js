"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const index = file.originalname.indexOf('.');
        const type = file.originalname.slice(index);
        cb(null, file.fieldname + '-' + Date.now() + type);
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
