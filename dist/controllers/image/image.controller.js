"use strict";
// controllers/imageController.ts
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
exports.deleteImage = exports.getImageById = exports.getAllImages = exports.uploadImage = void 0;
const imageModel_1 = __importDefault(require("../../models/imageModel"));
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No image file provided" });
            return;
        }
        const image = new imageModel_1.default({
            filename: req.file.filename,
            filepath: req.file.path,
        });
        const savedImage = yield image.save();
        res.status(201).json(savedImage);
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Error uploading image" });
    }
});
exports.uploadImage = uploadImage;
const getAllImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield imageModel_1.default.find();
        res.status(200).json(images);
    }
    catch (error) {
        console.error("Error retrieving images:", error);
        res.status(500).json({ error: "Error retrieving images" });
    }
});
exports.getAllImages = getAllImages;
const getImageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield imageModel_1.default.findById(req.params.id);
        if (image) {
            res.status(200).json(image);
        }
        else {
            res.status(404).json({ error: "Image not found" });
        }
    }
    catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).json({ error: "Error retrieving image" });
    }
});
exports.getImageById = getImageById;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield imageModel_1.default.findByIdAndDelete(req.params.id);
        if (image) {
            res.status(200).json({ message: "Image deleted" });
        }
        else {
            res.status(404).json({ error: "Image not found" });
        }
    }
    catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: "Error deleting image" });
    }
});
exports.deleteImage = deleteImage;
