import { Request, Response } from "express";
import Services, { IService } from "../../models/services";

export const createService = async (req: Request, res: Response) => {
    try {
        const { title, content, image, creator } = req.body;

        const newService: IService = new Services({
            title,
            content,
            image,
            creator,
        })

        const savedService = await newService.save();

        return res.status(201).json({ message: "Service created successfully", service: savedService });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await Services.find();

        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params;

        const service = await Services.findById(serviceId);

        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }

        return res.status(200).json(service);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params;
        const { title, content, image, creator } = req.body;

        const updatedService = await Services.findByIdAndUpdate(
            serviceId,
            { title, content, image, creator },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
        }

        return res.status(200).json(updatedService);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params;

        const deletedService = await Services.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({ error: "Service not found" });
        }

        return res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
