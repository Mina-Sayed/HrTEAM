"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PackageSchema = new mongoose_1.Schema({
    name_ar: String,
    name_en: String,
    duration: Number,
    sale: Number,
    maxCompaniesAllowed: Number,
    maxEmployeesAllowed: Number,
    price_SR: Number,
    price_USD: Number,
}, { timestamps: true });
const Package = (0, mongoose_1.model)('Package', PackageSchema);
exports.default = Package;
