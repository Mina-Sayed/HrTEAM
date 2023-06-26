"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shift = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongodb_1 = require("mongodb");
const enums_1 = require("../types/enums");
const schema = new mongoose_1.Schema({
    start_day: Number,
    end_day: Number,
    time: {
        start_hour: Number,
        end_hour: Number,
        start_mins: {
            type: Number,
            default: 0
        },
        end_mins: {
            type: Number,
            default: 0
        },
        originalTime: {
            hours: Number,
            mins: {
                type: Number,
                default: 0
            },
        }
    },
    origianalDays: [Number],
    name: String,
    branch: {
        type: mongodb_1.ObjectId,
        ref: "Branches",
    },
    allows: {
        weeklyHolidays: [Number],
        lateTime: {
            hours: {
                type: Number,
                default: 0
            },
            mins: {
                type: Number,
                default: 0
            },
        },
        leavingTime: {
            hours: {
                type: Number,
                default: 0
            },
            mins: {
                type: Number,
                default: 0
            },
        },
        overTime: {
            hour: {
                type: Number,
                default: 0
            },
            mins: {
                type: Number,
                default: 0
            },
        }
    },
    clicked: {
        type: Number,
        default: 0
    }
});
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isNew)
            return next();
        this.time.originalTime.hours = (this.time.end_hour - this.time.start_hour);
        this.time.originalTime.mins = (this.time.end_mins - this.time.start_mins);
        const weeklyHolidays = [];
        const origianalDays = [];
        for (let index = this.end_day; index >= this.start_day; index--) {
            origianalDays.push(index);
        }
        for (let index = 0; index < enums_1.days.length; index++) {
            const day = enums_1.days[index];
            if (!origianalDays.includes(day)) {
                weeklyHolidays.push(day);
            }
        }
        this.allows.weeklyHolidays = weeklyHolidays;
        this.origianalDays = origianalDays;
        next();
    });
});
exports.Shift = mongoose_1.default.model('shift', schema);
