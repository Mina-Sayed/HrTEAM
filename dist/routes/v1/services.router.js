"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_controller_1 = require("../../controllers/services/services.controller");
const router = express_1.default.Router();
router.post("/", services_controller_1.createService);
router.get("/", services_controller_1.getAllServices);
router.get("/:serviceId", services_controller_1.getServiceById);
router.put("/:serviceId", services_controller_1.updateService);
router.delete("/:serviceId", services_controller_1.deleteService);
exports.default = router;
