// faq router
import express from "express";
import { createFaq, getAllFaqs } from "../../controllers/faq/faq.controller";

const router = express.Router();

// Create a new faq
router.post("/", createFaq);

// Get all faqs
router.get("/", getAllFaqs);

export default router;
