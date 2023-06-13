import mongoose, { Schema, model, ObjectId } from "mongoose";
import { IPackage } from "./package";


export interface ISubscription
{
  startDate: Date,
  endDate: Date,
  isExpired: boolean,
  isActive: boolean,
  subscriber: ObjectId,
  package: ObjectId,
  paid_SR: number,
  paid_USD: number,
  companiesAllowed: number,
  employeesAllowed: number

}


const SubscriptionSchema = new Schema<ISubscription>({
  startDate: {
    type: Date,
    default: Date.now(),
  },
  endDate: Date,
  subscriber: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  package: {
    type: mongoose.Types.ObjectId,
    ref: "Package",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  paid_SR: Number,
  paid_USD: Number,
  companiesAllowed: Number,
  employeesAllowed: Number,

});

SubscriptionSchema.pre("save", async function (next)
{
  if (!this.isNew) {
    return next();
  }
  const {
    price_SR,
    price_USD,
    duration,
    sale,
    maxCompaniesAllowed,
    maxEmployeesAllowed,
  } = (await this.populate<{
    package: IPackage
  }>("package", "duration price_SR price_USD sale maxCompaniesAllowed maxEmployeesAllowed")).package;
  this.endDate = new Date(new Date(this.startDate).setMonth(new Date(this.startDate).getMonth() + duration));
  this.paid_SR = price_SR - sale * price_SR / 100;
  this.paid_USD = price_USD - sale * price_USD / 100;
  this.companiesAllowed = maxCompaniesAllowed;
  this.employeesAllowed = maxEmployeesAllowed;
  next();
});


const Subscription = model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;