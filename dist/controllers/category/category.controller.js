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
exports.DeleteCategory = exports.UpdateCategory = exports.getCategoryById = exports.getAllCategory = exports.addCategory = void 0;
const Category_1 = __importDefault(require("../../models/Category"));
const User_1 = __importDefault(require("../../models/User"));
const SubCategory_1 = __importDefault(require("../../models/SubCategory"));
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check if the Category exist
    let { categoryType, company } = req.body;
    categoryType = categoryType.toLowerCase().replace(/\s+/g, ' ').trim();
    const user = yield User_1.default.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    const categoryExist = yield Category_1.default.findOne({ categoryType: categoryType });
    if (categoryExist)
        return res.status(400).send({ message_en: 'Category Already Exist' });
    if ((user.role == 'admin' || user.role == 'root') && !company)
        return res
            .status(400)
            .send({ error_en: 'Company is required to add the category in it' });
    // create new Category
    const categroy = new Category_1.default({
        categoryType: categoryType,
        company: company,
    });
    yield categroy.save();
    res.status(201).send({ message_en: 'Category Added Succesfuly', categroy });
});
exports.addCategory = addCategory;
//====================================================================================//
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const categories = yield Category_1.default.find({
        company: [
            undefined,
            req.query.company ? req.query.company : (_b = req.user) === null || _b === void 0 ? void 0 : _b.company,
        ],
    });
    if (!categories[0])
        return res.status(400).send({ error_en: 'Categories Not Found' });
    res.status(200).send({
        message_en: 'Category Fetched Succesfuly',
        categories,
        count: categories.length,
    });
});
exports.getAllCategory = getAllCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const existedCategory = yield Category_1.default.findById(id);
    if (!existedCategory)
        return res.status(400).send({ error_en: 'Category Not Found' });
    res.status(200).send({
        message_en: 'category fetched succesfuly',
        cateogry: existedCategory,
    });
});
exports.getCategoryById = getCategoryById;
//===================================================================================//
const UpdateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    // check if the desired Category is Exist or not
    let { categoryType } = req.body;
    categoryType = categoryType.toLowerCase().replace(/\s+/g, ' ').trim();
    const categoryExist = yield Category_1.default.findOne({ categoryType: categoryType });
    if (categoryExist)
        return res.status(400).send({ message_en: 'Category Already Exist' });
    const category = yield Category_1.default.findById(categoryId);
    if (!category) {
        return res.status(400).send({ error_en: 'Category Not Found' });
    }
    const categoryToUpdate = yield Category_1.default.findByIdAndUpdate(categoryId, { categoryType }, { returnOriginal: false });
    res.status(200).send({
        message_en: 'Category Updated Successfuly',
        category: categoryToUpdate,
    });
});
exports.UpdateCategory = UpdateCategory;
// ========================================================================================//
const DeleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const deletedCategory = yield Category_1.default.findByIdAndDelete(categoryId);
    yield SubCategory_1.default.deleteMany({ category: categoryId });
    res.status(200).send({ message_en: 'Category Deleted Successfuly' });
});
exports.DeleteCategory = DeleteCategory;
// ====================================================================================//
