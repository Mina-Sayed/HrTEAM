import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import mongoose, { Document, model, Schema } from "mongoose";
import { MartialStatus, Roles } from "../types/enums";


export interface IUser extends Document
{
    fullName_ar: string;
    fullName_en: string;
    userName_ar: string;
    userName_en: string;
    nationalId: string;
    position: string;
    email: string;
    password: string;
    role: Roles;
    residencyExpiration: Date;
    nationality: string;
    phone: string;
    phone2: string;
    address: string;
    city: string;
    birthDate: Date;
    maritalStatus: MartialStatus;
    department: ObjectId;
    company: ObjectId;
    branch: ObjectId;
    createToken: () => string;
    isPasswordsMatched: (enteredPassword: string) => Promise<boolean>;
    shift: ObjectId;
    image: String;
}

const UserSchema = new Schema(
    {
        fullName_ar: String,
        fullName_en: String,
        userName_ar: String,
        userName_en: String,
        nationalId: String,
        position: String,
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: "user",
        },
        residencyExpiration: Date,
        nationality: String,
        phone: String,
        phone2: String,
        address: {
            type: String,
            default: "",
        },
        city: String,
        birthDate: Date,
        maritalStatus: String,
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        shift: {
            type: ObjectId,
            ref: "Shift",
        },
        image: {
            type: String,
            default: "avatar.jpg",
        },
    },
    { timestamps: true },
);

// Hash password
UserSchema.pre("save", async function (next)
{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Check if passwords are matched
UserSchema.methods.isPasswordsMatched = async function (
    enteredPassword: string,
)
{
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.createToken = function ()
{
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role,
        },
        process.env.JWT_KEY!,
    );
};

const User = model<IUser>("User", UserSchema);

export default User;
