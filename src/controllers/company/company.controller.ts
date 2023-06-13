import { NextFunction, Response } from "express";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Company } from "../../models/company";
import Subscription from "../../models/subscription";
import User from "../../models/user";
import { Branch } from "../../models/branch";
import { Department } from "../../models/department";
import { Shift } from "../../models/shift";
import { Attendance } from "../../models/attendance";
import { Break } from "../../models/break";
import Request from "../../models/request";
import Payroll from "../../models/payroll";
import Contract from "../../models/contract";
import { Notification } from "../../models/notification";
import Blog from "../../models/blog";
import Task from "../../models/task";
import Subtask from "../../models/subtask";
import Category from "../../models/category";
//@desc         create a company
//@route        POST /api/v1/company
//@access       private(root) 
export const addCompany = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        const { name } = req.body;
        const ownerId = req.user?._id;
        const subscription: any = await Subscription.findOne({ subscriber: req.user?._id });

        // Check if the owner has exceeded the limit of their Companies Allowed
        const companies: any = await Company.find({ owner: ownerId });
        if (subscription?.companiesAllowed == companies.length) {
            return res.status(400).send({
                error_en: "You have exceeded the limit of your Companies Allowed",
                error_ar: "لقد تجاوزت الحد المسموح به لشركاتك",
            });
        }

        // Check if the company name is unique
        const nameCo = await Company.findOne({
            owner: ownerId,
            name: name,
        });
        if (nameCo) {
            return res.status(400).send({ error_en: "The company name is already in use" });
        }

        const company = new Company({
            owner: ownerId,
            name: name,
        });

        await company.save();

        res.status(201).send({
            success: true,
            data: company,
            message_en: "Company created successfully",
        });
    } catch (error) {
        console.log(error); // pass the error to the next middleware
    }
};


//@desc         get all companies owner
//@route        GET /api/v1/company
//@access       private(root,admin)
export const getOwnerCompanies = async (
    req: AuthenticatedReq,
    res: Response,
) =>
{
    const ownerId = req.user?._id;
    const companies: any = await Company.find({ owner: ownerId });
    res.send({
        success: true,
        data: companies,
        message_en: "Companies are fetched successfully",
    });
};
//@desc         get a company by name
//@route        GET /api/v1/company/:id
//@access       private(root,admin)
export const getCompanyByName = async (
    req: AuthenticatedReq,
    res: Response,
) =>
{
    const ownerId = req.user?._id;
    const company: any = await Company.findOne({
        owner: ownerId,
        _id: req.params.id,
    });
    res.status(200).send({
        success: true,
        data: company,
        message_en: "Company is fetched successfully",
    });
};
//@desc         update a company by name
//@route        PUT /api/v1/company/:id
//@access       private(root)
export const updateCompanyByName = async (
    {
        params,
        body,
        user,
    }: AuthenticatedReq,
    res: Response,
) =>
{
    const { name } = body;
    const ownerId = user?._id;

    const company = await Company.findOne({
        name,
        _id: params.id,
    });
    if (company) {
        return res
            .status(400)
            .send({ error_en: "The company with the given name used before" });
    }

    const newCompany = await Company.findOneAndUpdate(
        {
            owner: ownerId,
            _id: params.id,
        },
        { name },
        { new: true },
    );
    if (!newCompany) {
        return res
            .status(404)
            .send({ error_en: "The company was not found with given name" });
    }

    res.status(200).send({
        success: true,
    });
};
//@desc         delete a company by id
//@route        DELETE /api/v1/company/:id
//@access       private(root)

export const deleteCompanyById = async (req: AuthenticatedReq, res: Response) =>
{
    const companyId: string = req.params.id as string;

    if (!companyId) {
        return res.status(400).send({
            success: false,
            message: "Please provide a company id!",
        });
    }

    try {
        const foundCompany = await Company.findOne({ _id: companyId });

        if (!foundCompany) {
            return res.status(404).send({
                success: false,
                message: "The company with the given ID is not found",
            });
        }

        const branches = await Branch.find({ company: companyId }, "_id");
        const branchIds = branches.map((branch) => branch._id);

        await Promise.all([
            User.deleteMany({ company: companyId }),
            Department.deleteMany({ branch: { $in: branchIds } }),
            Shift.deleteMany({ branch: { $in: branchIds } }),
            Attendance.deleteMany({ branch: { $in: branchIds } }),
            Request.deleteMany({ branch: { $in: branchIds } }),
            Payroll.deleteMany({ branch: { $in: branchIds } }),
            Contract.deleteMany({ branch: { $in: branchIds } }),
            Branch.deleteMany({ company: companyId }),
            Notification.deleteMany({ company: companyId }),
            Blog.deleteMany({ company: companyId }),
            Task.deleteMany({ company: companyId }),
            Subtask.deleteMany({ company: companyId }),
            Category.deleteMany({ company: companyId }),
            Company.deleteOne({ _id: companyId }),
        ]);

        res.status(200).send({
            success: true,
            message: "Company is deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while deleting the company",
        });
    }
};
