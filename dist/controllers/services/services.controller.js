"use strict";
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
exports.deleteService = exports.updateService = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const services_1 = __importDefault(require("../../models/services"));
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, image, creator } = req.body;
        const newService = new services_1.default({
            title,
            content,
            image,
            creator,
        });
        const savedService = yield newService.save();
        return res.status(201).json({ message: "Service created successfully", service: savedService });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createService = createService;
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield services_1.default.find();
        return res.status(200).json(services);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllServices = getAllServices;
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId } = req.params;
        const service = yield services_1.default.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.status(200).json(service);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getServiceById = getServiceById;
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId } = req.params;
        const { title, content, image, creator } = req.body;
        const updatedService = yield services_1.default.findByIdAndUpdate(serviceId, { title, content, image, creator }, { new: true });
        if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.status(200).json(updatedService);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateService = updateService;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId } = req.params;
        const deletedService = yield services_1.default.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.status(200).json({ message: "Service deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteService = deleteService;
