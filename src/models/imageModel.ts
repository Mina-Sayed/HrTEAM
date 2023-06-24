// models/imageModel.ts

import mongoose, { Document, Model } from "mongoose";

interface IImage extends Document {
  filename: string;
  filepath: string;
}

const ImageSchema = new mongoose.Schema<IImage>({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
});

const Image: Model<IImage> = mongoose.model<IImage>("Image", ImageSchema);

export default Image;
