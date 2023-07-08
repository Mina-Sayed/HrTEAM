import express from "express";
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} from "../../controllers/services/services.controller";
import { upload } from "../../middlewares/uploads";

const router = express.Router();

router.post("/", upload.single('image'),createService);
router.get("/", getAllServices);
router.get("/:serviceId", getServiceById);
router.put("/:serviceId", updateService);
router.delete("/:serviceId", deleteService);

export default router;
