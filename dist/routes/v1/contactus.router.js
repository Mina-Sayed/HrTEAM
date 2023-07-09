"use strict";
// ContactUs routes
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactus_controller_1 = require("../../controllers/contactUS/contactus.controller");
const router = (0, express_1.Router)();
router.post("/", contactus_controller_1.createContactUs);
router.get("/", contactus_controller_1.getAllContactUss);
exports.default = router;
