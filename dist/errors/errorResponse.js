"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErorrResponse = void 0;
class ErorrResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.status = status;
    }
}
exports.ErorrResponse = ErorrResponse;
