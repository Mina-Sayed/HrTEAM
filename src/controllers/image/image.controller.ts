import { Request, Response } from "express";
import Image, { IImage } from "../../models/imageModel";


export const uploadImage = async (req: Request, res: Response) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname } = req.file;

    // Create a new image document
    const newImage: IImage = await Image.create({ imageCilent: originalname });

    return res.status(201).json(newImage);
  } catch (error) {
    console.error("Error saving image:", error);
    return res.status(500).json({ error: "Failed to save image" });
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

// export const getImageById = async (req: Request, res: Response) => {
//   try {
//     const image = await Image.findById(req.params.id);
//     if (image) {
//       res.status(200).json(image);
//     } else {
//       res.status(404).json({ error: "Image not found" });
//     }
//   } catch (error) {
//     console.error("Error retrieving image:", error);
//     res.status(500).json({ error: "Error retrieving image" });
//   }
// };

// export const deleteImage = async (req: Request, res: Response) => {
//   try {
//     const image = await Image.findByIdAndDelete(req.params.id);
//     if (image) {
//       res.status(200).json({ message: "Image deleted" });
//     } else {
//       res.status(404).json({ error: "Image not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ error: "Error deleting image" });
//   }
// };
