import mongoose, { Schema } from "mongoose";


export interface ISubCategory
{
  subType: String,
  haveTime: Boolean,
  category: mongoose.Schema.Types.ObjectId,
  start: Date,
  end: Date
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    subType: {
      type: String,
      required: true,
    },
    haveTime: {
      type: Boolean,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },


  },
);

const SubCategory = mongoose.model<ISubCategory>("SubCategory", subCategorySchema);
export default SubCategory;




