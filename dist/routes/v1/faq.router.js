"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// faq router
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("../../controllers/faq/faq.controller");
const router = express_1.default.Router();
// Create a new faq
router.post("/", faq_controller_1.createFaq);
// Get all faqs
router.get("/", faq_controller_1.getAllFaqs);
exports.default = router;
