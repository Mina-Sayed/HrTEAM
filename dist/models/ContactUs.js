"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ContactUs model
//
const mongoose_1 = require("mongoose");
const ContactUsSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    // email is unique and required  
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});
exports.default = (0, mongoose_1.model)('ContactUs', ContactUsSchema);
