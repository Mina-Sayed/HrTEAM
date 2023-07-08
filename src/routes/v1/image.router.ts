// routes/imageRoutes.ts

import express from "express";
import { uploadImage, getAllImages} from "../../controllers/image/image.controller";
import { upload } from "../../middlewares/uploads";

const router = express.Router();

router.post("/images", upload.single("image"),uploadImage);
router.get("/images", getAllImages);
// router.get("/images/:id", getImageById);
// router.delete("/images/:id", deleteImage);

export default router;
