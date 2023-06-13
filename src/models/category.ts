import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";


export interface ICategory
{
  categoryType: String,
  company: ObjectId
}

const categorySchema = new Schema<ICategory>({
  categoryType: {
    type: String,
    required: true,
  },
  company: {
    type: ObjectId,
  },
}, { timestamps: true });

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;


