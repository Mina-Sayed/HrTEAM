
import { Request, Response } from "express";
import Faq from "../../models/Faq";

export const createFaq = async (req: Request, res: Response) => {
    try {
        const { title, desc } = req.body;

        const faq = await Faq.create({ title, desc });

        return res.status(201).json(faq);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create faq" });
    }
}

export const getAllFaqs = async (_req: Request, res: Response) => {
    try {
        const faqs = await Faq.find();
        return res.status(200).json(faqs);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};




