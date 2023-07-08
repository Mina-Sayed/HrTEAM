"use strict";
// Faq Models
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FaqSchema = new mongoose_1.Schema({
    title: {
        type: String,
        // required: true,
    },
    desc: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});
exports.default = (0, mongoose_1.model)('Faq', FaqSchema);
