
// ContactUs routes

import { Router } from "express";
import { createContactUs, getAllContactUss } from "../../controllers/contactUS/contactus.controller";

const router = Router();

router.post("/", createContactUs);
router.get("/", getAllContactUss);

export default router;