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
const colors_1 = __importDefault(require("colors"));
const fs_1 = __importDefault(require("fs"));
const User_1 = __importDefault(require("../models/User"));
const Packages_1 = __importDefault(require("../models/Packages"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Company_1 = require("../models/Company");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../config/development.env`) });
const Users = JSON.parse(fs_1.default.readFileSync('./users.json', 'utf-8'));
const Packages = JSON.parse(fs_1.default.readFileSync('./packages.json', 'utf-8'));
const Companies = JSON.parse(fs_1.default.readFileSync('./companies.json', 'utf-8'));
//  Pushing data to db
const pushJsonData = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    yield collection.create(data);
});
//Delete all data
const deleteAllModelData = (collection) => __awaiter(void 0, void 0, void 0, function* () {
    yield collection.deleteMany({});
});
const addAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pushJsonData(Companies, Company_1.Company);
        yield pushJsonData(Users, User_1.default);
        yield pushJsonData(Packages, Packages_1.default);
        console.log(colors_1.default.bgBlue.white.bold('all data is added'));
    }
    catch (err) {
        console.log(`Error while seeding data ${err}`);
        process.exit(1);
    }
});
const removeAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield deleteAllModelData(User_1.default);
        yield deleteAllModelData(Packages_1.default);
        yield deleteAllModelData(Company_1.Company);
        console.log(colors_1.default.bgRed.white.bold('all data is deleted'));
    }
    catch (err) {
        console.log(colors_1.default.bgRed.white.bold(`Error while deleteing data ${err}`));
        process.exit(1);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const operation = process.argv[2];
    try {
        if (operation === 'i') {
            yield mongoose_1.default.connect(process.env.MONGO_URI);
            yield addAllData();
        }
        if (operation === 'd') {
            yield mongoose_1.default.connect(process.env.MONGO_URI);
            yield removeAllData();
        }
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}))();
