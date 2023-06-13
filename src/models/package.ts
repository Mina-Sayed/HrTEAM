import { Schema, model } from "mongoose";


export interface IPackage
{
  name_ar: string,
  name_en: string,
  duration: number,
  sale: number,
  maxCompaniesAllowed: number,
  maxEmployeesAllowed: number
  price_SR: number,
  price_USD: number,
}

const PackageSchema = new Schema<IPackage>({
  name_ar: String,
  name_en: String,
  duration: Number,
  sale: Number,
  maxCompaniesAllowed: Number,
  maxEmployeesAllowed: Number,
  price_SR: Number,
  price_USD: Number,
}, { timestamps: true });

const Package = model<IPackage>("Package", PackageSchema);
export default Package;