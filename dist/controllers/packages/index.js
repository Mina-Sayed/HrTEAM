"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePackage = exports.updatePackage = exports.createPackage = exports.getPackageById = exports.getAllPackages = void 0;
const Packages_1 = __importDefault(require("../../models/Packages"));
//@desc         get all packages
//@route        GET /api/v1/packages
//@access       public
const getAllPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allPackages = yield Packages_1.default.find({});
    res.send({
        success: true,
        data: allPackages,
        message: 'packages are fetched successfully'
    });
});
exports.getAllPackages = getAllPackages;
//@desc         get package by id
//@route        GET /api/v1/packages
//@access       public
const getPackageById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const packageFetched = yield Packages_1.default.findById(req.params.id);
    res.send({
        success: true,
        data: packageFetched,
        message: 'package is fetched successfully'
    });
});
exports.getPackageById = getPackageById;
//@desc         create a package
//@route        POST /api/v1/packages
//@access       private(super admin)
const createPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const packageCreated = yield Packages_1.default.create(req.body);
    res.status(201).send({
        success: true,
        data: packageCreated,
        message: 'package is created successfully'
    });
});
exports.createPackage = createPackage;
//@desc         update a package
//@route        PATCH /api/v1/packages/:id
//@access       private(super admin)
const updatePackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const packageCreated = yield Packages_1.default.create(req.body);
    res.send({
        success: true,
        data: packageCreated,
        message: 'package is updated successfully'
    });
});
exports.updatePackage = updatePackage;
//@desc         delete a package
//@route        DELETE /api/v1/packages/:id
//@access       private(super admin)
const deletePackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield Packages_1.default.findByIdAndRemove(req.params.id);
    res.status(204).send({
        success: true,
        message: 'package is deleted successfully'
    });
});
exports.deletePackage = deletePackage;
