import { Request, Response } from "express";
import Image, { IImage } from "../../models/imageModel";
import { upload } from "../../middlewares/uploads";

export const uploadImage = (req: Request, res: Response) => {
  upload.single("image")(req, res, async (err: any) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    if (!req.file) {
      console.log("No image uploaded");
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { originalname, filename, path } = req.file;

    try {
      // Create a new image document
      const newImage: IImage = await Image.create({
        imageClient: originalname,
      });

      return res.status(201).json(newImage);
    } catch (error) {
      console.error("Error saving image:", error);
      return res.status(500).json({ error: "Failed to save image" });
    }
  });
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
