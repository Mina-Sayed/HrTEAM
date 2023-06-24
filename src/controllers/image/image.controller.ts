// controllers/imageController.ts

import { Request, Response } from "express";
import Image from "../../models/imageModel";

export const uploadImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }
  
      const image = new Image({
        filename: req.file.filename,
        filepath: req.file.path,
      });
  
      const savedImage = await image.save();
      res.status(201).json(savedImage);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Error uploading image" });
    }
  };
  
export const getAllImages = async (req: Request, res: Response) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Error retrieving images" });
  }
};

export const getImageById = async (req: Request, res: Response) => {
  try {
    const image = await Image.findById(req.params.id);
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ error: "Error retrieving image" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (image) {
      res.status(200).json({ message: "Image deleted" });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Error deleting image" });
  }
};
