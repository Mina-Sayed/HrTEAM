"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packages_1 = require("../../controllers/packages");
const acsses_1 = require("../../middlewares/acsses");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const enums_1 = require("../../types/enums");
const packageValidator_1 = __importDefault(require("../../validators/packageValidator"));
const packageRouter = (0, express_1.Router)();
packageRouter.route('/')
    .get(packages_1.getAllPackages)
    .post(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN), (0, validate_1.validator)(packageValidator_1.default, "post"), packages_1.createPackage);
packageRouter.route('/:id')
    .get(packages_1.getPackageById)
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN))
    .put((0, validate_1.validator)(packageValidator_1.default, "put"), packages_1.updatePackage)
    .delete(packages_1.deletePackage);
exports.default = packageRouter;
