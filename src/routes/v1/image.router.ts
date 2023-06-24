// routes/imageRoutes.ts

import express from "express";
import { uploadImage, getAllImages, getImageById, deleteImage } from "../../controllers/image/image.controller";

const router = express.Router();

router.post("/images", uploadImage);
router.get("/images", getAllImages);
router.get("/images/:id", getImageById);
router.delete("/images/:id", deleteImage);

export default router;
