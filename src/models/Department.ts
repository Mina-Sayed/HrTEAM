import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";
import Joi from "joi"
export const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    branch: {
        type: ObjectId,
        required: true,
        ref: 'Branches'
    },
    clicked:{
        type:Number,
        default:0
    }
}, { timestamps: true });
export const Department = mongoose.model('Departments', departmentSchema);
export function validateDepartment(department: any) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        branch: Joi.objectId().required()
    });
    const result = schema.validate(department);
    return result;
}

