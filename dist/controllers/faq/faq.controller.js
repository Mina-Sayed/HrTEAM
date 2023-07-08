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
exports.getAllFaqs = exports.createFaq = void 0;
const Faq_1 = __importDefault(require("../../models/Faq"));
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, desc } = req.body;
        const faq = yield Faq_1.default.create({ title, desc });
        return res.status(201).json(faq);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create faq" });
    }
});
exports.createFaq = createFaq;
const getAllFaqs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield Faq_1.default.find();
        return res.status(200).json(faqs);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllFaqs = getAllFaqs;
