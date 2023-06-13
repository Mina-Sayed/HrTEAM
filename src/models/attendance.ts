import { ObjectId } from "mongodb";
import { model } from "mongoose";
import { Schema } from "mongoose";


export const Attendance = model(
    "attendance",
    new Schema(
        {
            member: {
                type: ObjectId,
                ref: "User",
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
                type: ObjectId,
                ref: "shifts",
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
                    overId: ObjectId,

                },
            ],
            branch: {
                type: ObjectId,
                ref: "branches",
            },
            department: {
                type: ObjectId,
                ref: "departments",
            },
        },
        {
            timestamps: true,
        },
    ),
);
