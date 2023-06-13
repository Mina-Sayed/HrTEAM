import { NextFunction, Response } from "express";
import { AuthenticatedReq } from "../../middlewares/auth";
import Category from "../../models/category";
import User from "../../models/user";
import SubCategory from "../../models/subCategory";


export const addCategory = async (req: AuthenticatedReq, res: Response) =>
{
    // check if the Category exist
    let {
        categoryType,
        company,
    } = req.body;
    categoryType = categoryType.toLowerCase().replace(/\s+/g,
        " ").trim();
    const user: any = await User.findOne({ _id: req.user?._id });
    const categoryExist = await Category.findOne({ categoryType: categoryType });
    if (categoryExist) {
        return res.status(400).send({ message_en: "Category Already Exist" });
    }
    if ((user.role == "admin" || user.role == "root") && !company) {
        return res
            .status(400)
            .send({ error_en: "Company is required to add the category in it" });
    }
    // create new Category
    const category = new Category({
        categoryType: categoryType,
        company: company,
    });
    await category.save();
    res.status(201).send({
        message_en: "Category added successfully",
        category: category,
    });
};
//====================================================================================//
export const getAllCategory = async (req: AuthenticatedReq, res: Response) =>
{
    const categories = await Category.find({
        company: [
            undefined,
            req.query.company ? req.query.company : req.user?.company,
        ],
    });
    if (!categories[0]) {
        return res.status(404).send({ error_en: "Categories Not Found" });
    }
    res.status(200).send({
        message_en: "Category fetched successfully",
        categories,
        count: categories.length,
    });
};
export const getCategoryById = async (req: AuthenticatedReq, res: Response) =>
{
    const id = req.params.id;
    const existedCategory = await Category.findById(id);
    if (!existedCategory) {
        return res.status(404).send({ error_en: "Category Not Found" });
    }
    res.status(200).send({
        message_en: "category fetched successfully",
        category: existedCategory,
    });
};

//===================================================================================//
export const UpdateCategory = async (req: AuthenticatedReq, res: Response) =>
{
    const categoryId = req.params.id;

    // check if the desired Category is Exist or not
    let { categoryType } = req.body;
    categoryType = categoryType.toLowerCase().replace(/\s+/g,
        " ").trim();
    const categoryExist = await Category.findOne({ categoryType: categoryType });
    if (categoryExist) {
        return res.status(400).send({ message_en: "Category already exist" });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).send({ error_en: "Category not found" });
    }

    const categoryToUpdate = await Category.findByIdAndUpdate(
        categoryId,
        { categoryType },
        { returnOriginal: false },
    );
    res.status(200).send({
        message_en: "Category updated successfully",
        category: categoryToUpdate,
    });
};
// ========================================================================================//
export const DeleteCategory = async (req: AuthenticatedReq, res: Response) =>
{
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    await SubCategory.deleteMany({ category: categoryId });
    res.status(200).send({ message_en: "Category deleted successfully" });
};

// ====================================================================================//
