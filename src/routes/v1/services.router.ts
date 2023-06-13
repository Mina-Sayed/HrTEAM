import express from "express";
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} from "../../controllers/services/services.controller";

const router = express.Router();

router.post("/", createService);
router.get("/", getAllServices);
router.get("/:serviceId", getServiceById);
router.put("/:serviceId", updateService);
router.delete("/:serviceId", deleteService);

export default router;
