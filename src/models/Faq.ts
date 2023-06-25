// Faq Models

import { Schema, model } from 'mongoose';

const FaqSchema = new Schema({
    title: {
        type: String,
        // required: true,
    },
    desc: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

export default model('Faq', FaqSchema);




