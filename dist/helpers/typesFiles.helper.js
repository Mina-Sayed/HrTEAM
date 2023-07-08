"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeFile = void 0;
function typeFile(filename) {
    const index = filename.indexOf('.');
    return filename.slice(index);
}
exports.typeFile = typeFile;
