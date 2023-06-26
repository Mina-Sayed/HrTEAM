"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.Attendance = (0, mongoose_1.model)('attendences', new mongoose_2.Schema({
    member: {
        type: mongodb_1.ObjectId,
        ref: 'User',
    },
    workingHours: {
        hours: {
            type: Number,
        },
        mins: {
            type: Number,
        },
    },
    originalTime: {
        hours: {
            type: Number,
        },
        mins: {
            type: Number,
        },
    },
    signIn: {
        type: Date,
    },
    signOut: {
        type: Date,
    },
    // location: {
    //     lat: {
    //         type: Number,
    //         required: true,
    //         trim: true,
    //         minlength: 5,
    //         maxlength: 50
    //     },
    //     lng: {
    //         type: Number,
    //         required: true,
    //         trim: true,
    //         minlength: 5,
    //         maxlength: 50
    //     }
    // },
    break: [
        {
            originalTime: {
                hours: {
                    type: Number,
                },
                mins: {
                    type: Number,
                },
            },
            start: Date,
            end: Date,
            signIn: Date,
            signOut: Date,
            status: Boolean,
            lateHours: {
                hours: Number,
                mins: Number,
            },
        },
    ],
    isCompleted: {
        type: Boolean,
    },
    lateHours: {
        hours: {
            type: Number,
        },
        mins: {
            type: Number,
        },
    },
    shift: {
        type: mongodb_1.ObjectId,
        ref: 'shifts',
    },
    overTime: [
        {
            originalTime: {
                hours: {
                    type: Number,
                },
                mins: {
                    type: Number,
                },
            },
            signIn: Date,
            signOut: Date,
            isCompleted: Boolean,
            lateHours: {
                hours: Number,
                mins: Number,
            },
            workingHours: {
                hours: {
                    type: Number,
                },
                mins: {
                    type: Number,
                },
            },
            overId: mongodb_1.ObjectId
        },
    ],
    branch: {
        type: mongodb_1.ObjectId,
        ref: "branches"
    },
    department: {
        type: mongodb_1.ObjectId,
        ref: "departments"
    }
}, {
    timestamps: true,
}));
