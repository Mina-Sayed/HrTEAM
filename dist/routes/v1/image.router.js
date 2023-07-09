"use strict";
// routes/imageRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("../../controllers/image/image.controller");
const router = express_1.default.Router();
router.post("/images", image_controller_1.uploadImage);
router.get("/images", image_controller_1.getAllImages);
router.get("/images/:id", image_controller_1.getImageById);
router.delete("/images/:id", image_controller_1.deleteImage);
exports.default = router;
