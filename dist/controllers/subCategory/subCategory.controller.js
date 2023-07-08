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
exports.deleteSubCategory = exports.updateSubCategory = exports.getAllSubCategories = exports.getSubCategory = exports.AddSubCategory = void 0;
const SubCategory_1 = __importDefault(require("../../models/SubCategory"));
const AddSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { subType, haveTime, category, start, end } = req.body;
    subType = subType.toLowerCase().replace(/\s+/g, " ");
    // check if the subCategory Exist 
    const isSubCategExist = yield SubCategory_1.default.findOne({ subType });
    if (isSubCategExist)
        return res.status(400).send({ error_en: 'Sub Category Already Exist' });
    // create new Sub Category
    const newSubCategory = new SubCategory_1.default({
        subType,
        haveTime,
        category,
    });
    yield newSubCategory.save();
    res.status(200).send({ message_en: 'SubCategory Added Succesfuly', subCategory: newSubCategory });
});
exports.AddSubCategory = AddSubCategory;
const getSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategoryId = req.params.id;
    const subCategory = yield SubCategory_1.default.findById(subCategoryId).populate('category');
    console.log(subCategory);
    res.status(200).send({ message: 'SubCategory Fetched Succesfuly', subCategory });
});
exports.getSubCategory = getSubCategory;
const getAllSubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get The Category that relate to that sub Category
    const subCategories = yield SubCategory_1.default.find({ category: req.params.categoryId }).populate('category');
    if (!subCategories[0])
        return res.status(400).send({ message_en: 'SubCategories Not Found' });
    res.status(200).send({ message: 'SubCategories Fetched Succesfuly', subCategories });
});
exports.getAllSubCategories = getAllSubCategories;
const updateSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { subType, haveTime, start, end } = req.body;
    subType ? subType = subType.toLowerCase().replace(/\s+/g, " ") : null;
    const subCategoryId = req.params.id;
    // check if The subCategory Exist 
    const isSubCategExist = yield SubCategory_1.default.findById(subCategoryId);
    if (!isSubCategExist)
        return res.status(400).send({ error_en: 'Invalid SubCategory ' });
    // update the sub Category
    let updatedSubCategory;
    console.log((!start && !end && !subType));
    if (isSubCategExist.haveTime && !haveTime && (!start && !end && !subType)) {
        console.log("update from here");
        updatedSubCategory = yield SubCategory_1.default.findByIdAndUpdate(subCategoryId, { haveTime, start: null, end: null }, { returnOriginal: false }).populate('category');
    }
    else if (!isSubCategExist.haveTime && haveTime) {
        if (!start || !end)
            return res.status(400).send({ error_en: 'start time and end time are requierd' });
        updatedSubCategory = yield SubCategory_1.default.findByIdAndUpdate(subCategoryId, { haveTime, start: start, end: end }, { returnOriginal: false }).populate('category');
    }
    else {
        //check if any noe exist of the new
        const isSubCategName = yield SubCategory_1.default.findOne({ subType: subType });
        if (isSubCategName)
            return res.status(400).send({ error_en: 'Sub Category with given name already exist ' });
        updatedSubCategory = yield SubCategory_1.default.findByIdAndUpdate(subCategoryId, {
            subType: subType ? subType : isSubCategExist.subType,
            haveTime: haveTime ? haveTime : isSubCategExist.haveTime,
            start: start ? start : isSubCategExist.start,
            end: end ? end : isSubCategExist.end
        }, { returnOriginal: false }).populate('category');
    }
    // const updatedSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId, { subType, haveTime, category }, { returnOriginal: false }).populate('category')
    res.status(200).send({ message_en: 'Sub Category Updated Succesfuly', subCategory: updatedSubCategory });
});
exports.updateSubCategory = updateSubCategory;
const deleteSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get id of the sub Category
    const subCategoryId = req.params.id;
    // check if the subCategory exist or not 
    const isSubCategoryExist = yield SubCategory_1.default.findById(subCategoryId);
    if (!isSubCategoryExist)
        return res.status(400).send({ error_en: 'Sub Category Not Found' });
    // delete the desired SubCategory
    const subCategoryDeleted = yield SubCategory_1.default.findByIdAndDelete(subCategoryId);
    res.status(200).send({ message_en: 'sub Category Deleted Succesfuly' });
});
exports.deleteSubCategory = deleteSubCategory;
