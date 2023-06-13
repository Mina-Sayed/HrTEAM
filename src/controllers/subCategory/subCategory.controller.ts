import {Response, NextFunction} from "express";
import {AuthenticatedReq} from "../../middlewares/auth";
import SubCategory from "../../models/subCategory";


export const AddSubCategory = async (req: AuthenticatedReq, res: Response) =>
{
    let {subType, haveTime, category, start, end} = req.body;
    subType = subType.toLowerCase().replace(/\s+/g, " ");
    // check if the subCategory Exist 
    const isSubCategExist = await SubCategory.findOne({subType});
    if (isSubCategExist)
        return res.status(400).send({error_en: 'Sub Category Already Exist'});
    // create new Sub Category
    const newSubCategory = new SubCategory({
        subType,
        haveTime,
        category,
    });
    await newSubCategory.save();
    res.status(200).send({message_en: 'SubCategory Added Succesfuly', subCategory: newSubCategory});
};
export const getSubCategory = async (req: AuthenticatedReq, res: Response) =>
{
    const subCategoryId = req.params.id;
    const subCategory = await SubCategory.findById(subCategoryId).populate('category');
    console.log(subCategory);

    res.status(200).send({message: 'SubCategory Fetched Succesfuly', subCategory});
};
export const getAllSubCategories = async (req: AuthenticatedReq, res: Response) =>
{
    // get The Category that relate to that sub Category
    const subCategories = await SubCategory.find({category: req.params.categoryId}).populate('category');
    if (!subCategories[0])
        return res.status(400).send({message_en: 'SubCategories Not Found'});
    res.status(200).send({message: 'SubCategories Fetched Succesfuly', subCategories});
};

export const updateSubCategory = async (req: AuthenticatedReq, res: Response) =>
{
    let {subType, haveTime, start, end} = req.body;
    subType ? subType = subType.toLowerCase().replace(/\s+/g, " ") : null;
    const subCategoryId = req.params.id;
    // check if The subCategory Exist 
    const isSubCategExist = await SubCategory.findById(subCategoryId);
    if (!isSubCategExist)
        return res.status(400).send({error_en: 'Invalid SubCategory '});
    // update the sub Category
    let updatedSubCategory;
    console.log((!start && !end && !subType));

    if (isSubCategExist.haveTime && !haveTime && (!start && !end && !subType)) {
        console.log("update from here");

        updatedSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId,
            {haveTime, start: null, end: null},
            {returnOriginal: false}).populate('category');
    } else if (!isSubCategExist.haveTime && haveTime) {
        if (!start || !end)
            return res.status(400).send({error_en: 'start time and end time are requierd'});
        updatedSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId,
            {haveTime, start: start, end: end},
            {returnOriginal: false}).populate('category');
    } else {
        //check if any noe exist of the new
        const isSubCategName = await SubCategory.findOne({subType: subType});
        if (isSubCategName)
            return res.status(400).send({error_en: 'Sub Category with given name already exist '});

        updatedSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId,
            {
                subType: subType ? subType : isSubCategExist.subType,
                haveTime: haveTime ? haveTime : isSubCategExist.haveTime,
                start: start ? start : isSubCategExist.start,
                end: end ? end : isSubCategExist.end
            },
            {returnOriginal: false}).populate('category');

    }
    // const updatedSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId, { subType, haveTime, category }, { returnOriginal: false }).populate('category')
    res.status(200).send({message_en: 'Sub Category Updated Succesfuly', subCategory: updatedSubCategory});
};
export const deleteSubCategory = async (req: AuthenticatedReq, res: Response) =>
{
    // get id of the sub Category
    const subCategoryId = req.params.id;
    // check if the subCategory exist or not 
    const isSubCategoryExist = await SubCategory.findById(subCategoryId);
    if (!isSubCategoryExist)
        return res.status(400).send({error_en: 'Sub Category Not Found'});
    // delete the desired SubCategory

    const subCategoryDeleted = await SubCategory.findByIdAndDelete(subCategoryId);

    res.status(200).send({message_en: 'sub Category Deleted Succesfuly'});


};