"use strict";
// models/imageModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ImageSchema = new mongoose_1.default.Schema({
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
});
const Image = mongoose_1.default.model("Image", ImageSchema);
exports.default = Image;
