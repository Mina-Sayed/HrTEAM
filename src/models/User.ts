import { ObjectId } from 'mongodb';
import mongoose, { Schema, model, Model, Document } from 'mongoose';
import {  MartialStatusEnum, Roles } from '../types/enums';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export interface UserI extends Document {
    fullName_ar: string,
    fullName_en: string,
    userName_ar: string,
    userName_en: string,
    nationalId: string,
    position: string,
    email: string,
    password: string,
    role: Roles,
    residencyExpiration: Date,
    nationality: string,
    phone: string,
    phone2: string,
    address: string,
    city: string,
    birthDate: Date,
    maritalStatus: MartialStatusEnum,
    department: ObjectId,
    company: ObjectId,
    branch: ObjectId,
    createToken: () => string,
    isPasswordsMatched: (enteredPassword: string) => Promise<boolean>
    shift:ObjectId,
    image:String
    
}

const UserSchema = new Schema<any>({
    fullName_ar: String,
    fullName_en: String,
    userName_ar: String,
    userName_en: String,
    nationalId: String,
    position: String,
    email: String,
    password: String,
    role:{
      type:String,
      default:"user"
    },
    residencyExpiration: Date,
    nationality: String,
    phone: String,
    phone2: String,
    address: {
      type:String,
      default:''
    },
    city: String,
    birthDate: Date,
    maritalStatus: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Departments'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branches'
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company'
  },
  shift:{
    type:ObjectId,
    ref:"shift"
  },
  image:{
    type:String,
    default:'avatar.jpg'
  }
  
}, { timestamps: true });

// Hash password
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  });
  
//   Check if passwords are mathced

UserSchema.methods.isPasswordsMatched = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
UserSchema.methods.createToken = function () {
    return jwt.sign({ _id: this._id, email: this.email ,role:this.role }, process.env.JWT_KEY!);
  };
const User = model<UserI>('User', UserSchema);

export default User;


