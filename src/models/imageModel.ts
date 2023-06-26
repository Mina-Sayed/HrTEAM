import mongoose, { Document, Model } from "mongoose";

export interface IImage extends Document {
  imageCilent: string;
}

const ImageSchema = new mongoose.Schema<IImage>({
  imageCilent: { type: String, required: true },
});

const Image: Model<IImage> = mongoose.model<IImage>("Image", ImageSchema);

export default Image;
