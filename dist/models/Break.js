"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BreakSchema = new mongoose_1.default.Schema({
    start: {
        hours: Number,
        mins: {
            type: Number,
            default: 0
        }
    },
    end: {
        hours: Number,
        mins: {
            type: Number,
            default: 0
        }
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    duration: {
        hours: Number,
        mins: {
            type: Number,
            default: 0
        }
    },
    shift: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "shift"
    },
    users: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }],
});
exports.Break = mongoose_1.default.model('Break', BreakSchema);
