
// ContactUs controller

import { Request, Response } from "express";
import ContactUs from "../../models/ContactUs";

export const createContactUs = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        const contactUs = await ContactUs.create({ firstName, lastName, email, message });

        return res.status(201).json(contactUs);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create contactUs" });
    }
}

export const getAllContactUss = async (res: Response) => {
    try {
        const contactUss = await ContactUs.find();
        return res.status(200).json(contactUss);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

