// ContactUs model
//
import { Schema, model } from 'mongoose';

const ContactUsSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,

    },
    // email is unique and required  
    email: {
        type: String,
        required: true,
        unique: true,
    },

    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

export default model('ContactUs', ContactUsSchema);





