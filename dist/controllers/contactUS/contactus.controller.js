"use strict";
// ContactUs controller
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
exports.getAllContactUss = exports.createContactUs = void 0;
const ContactUs_1 = __importDefault(require("../../models/ContactUs"));
const createContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, message } = req.body;
        const contactUs = yield ContactUs_1.default.create({ firstName, lastName, email, message });
        return res.status(201).json(contactUs);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create contactUs" });
    }
});
exports.createContactUs = createContactUs;
const getAllContactUss = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactUss = yield ContactUs_1.default.find();
        return res.status(200).json(contactUss);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllContactUss = getAllContactUss;
