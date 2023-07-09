import { Request, Response } from "express";
import Services, { IService } from "../../models/services";
import { Types } from "mongoose";



export const createService = async (req: Request, res: Response) => {
    try {
      // Access the uploaded file through req.file
      if (req.file) {
        console.log("Uploaded image:", req.file.filename);
  
        const { title, content, creator } = req.body;
  
        // Create a new service with the file path
        const newService: IService = new Services({
          title,
          content,
          image: req.file.path, // Set the file path in the database
          creator: new Types.ObjectId(creator),
        });
  
        await newService.save();
  
        return res.status(201).json(newService);
      } else {
        console.log("No image uploaded");
  
        const { title, content, creator } = req.body;
  
        // Create a new service without the file path
        const newService: IService = new Services({
          title,
          content,
          creator: new Types.ObjectId(creator),
        });
  
        await newService.save();
  
        return res.status(201).json(newService);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      return res.status(500).json({ error: "Failed to create service" });
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
