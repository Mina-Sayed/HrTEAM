import { NextFunction, Response } from "express";
import { Branch } from "../../models/branch";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Department } from "../../models/department";
import { Shift } from "../../models/shift";
import { Attendance } from "../../models/attendance";
import Payroll from "../../models/payroll";
import Contract from "../../models/contract";
import Request from "../../models/request";
import User from "../../models/user";
import Task from "../../models/task";
import { Roles } from "../../types/enums";
//@desc         create a branch
//@route        POST /api/v1/branch
//@access       private(root)
export const addBranch = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const {
        name,
        lat,
        long,
        company,
        weeklyHolidays,
        fixedHolidays,
    } = req.body;
    //I:must check the company, his want add branch in it , he has this the company
    // const companyValid = await Company.find({ owner: ownerId, _id: company })
    // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot add a branch in this company because you are not the owner of the company" })
    //IV:must the name branch be unique
    const uniqueBranch = await Branch.findOne({
        name: name,
        company: company,
    });
    console.log(uniqueBranch);

    if (uniqueBranch) {
        return res
            .status(409)
            .send({ error_en: "The branch already exists" });
    }
    const branch = new Branch({
        name: name,
        company: company ? company : req.params.company,
        location: {
            lat: lat,
            long: long,
        },
    });
    await branch.save();
    res.status(201)
        .send({
            success: true,
            data: branch,
            message_en: "Branch is created successfully",
        });
};
//@desc         get all branches in company
//@route        GET /api/v1/branch
//@access       private(root)
export const getAllBranches = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const page = parseInt(req.query.page as string) || 1; // default to page 1 if no page parameter is provided
    const limit = parseInt(req.query.limit as string) || 10; // default to 10 results per page if no limit parameter is
    // provided

    let branches: Array<any>;
    const skip = (page - 1) * limit;
    if (req.user?.role === Roles.EMPLOYEE) {
        branches = await Branch.find({
            _id: req.user.branch,
        }).skip(skip).limit(limit);
    } else {
        branches = await Branch.find({ company: req.params.company })
            .skip(skip)
            .limit(limit);
    }
    for (let index = 0; index < branches.length; index++) {
        !branches[index].deps[0]
            ? branches[index].deps.push(
                ...(await Department.find({ branch: branches[index]._id })),
            )
            : branches[index].deps;
        if (index === branches.length - 1) {
            res.status(200).send({
                success: true,
                data: branches,
                message_en: "Branches fetched successfully",
            });
        }
    }
};
//@desc         get all branches in company
//@route        GET /api/v1/branch
//@access       private(root)
export const getAllBranchesWithData = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const page = parseInt(req.query.page as string) || 1; // default to page 1 if no page parameter is provided
    const limit = parseInt(req.query.limit as string) || 10; // default to 10 results per page if no limit parameter is provided

    let branches: Array<any>;
    const skip = (page - 1) * limit;
    if (req.user?.role === Roles.EMPLOYEE) {
        branches = await Branch.find({
            _id: req.user.branch,
        })
            .skip(skip)
            .limit(limit);
    } else {
        branches = await Branch.find({ company: req.params.company })
            .skip(skip)
            .limit(limit);
    }
    

    res.status(200).send({
        success: true,
        data: branches,
        message_en: "Branches fetched successfully",
    });
};
//@desc         get details branch in company
//@route        GET /api/v1/branch/:company/:name
//@access       private(root)
export const getBranch = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    //I:must check the company, his want get branch in it , he has this the company
    // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
    // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
    //II:check the branch found with company
    const branch = await Branch.findOne({
        company: req.params.company,
        _id: req.params.id,
    });

    if (!branch) {
        return res.status(404).send({ error_en: "Branch not found !" });
    }
    res.send({
        success: true,
        data: branch,
        message_en: "Branch fetched successfully",
    });
};
//@desc         update a branch
//@route        PUT /api/v1/branch/:company/:id
//@access       private(root)
export const updateBranch = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const {
        name,
        lat,
        long,
        fixedHolidays,
    } = req.body;
    const branch: any = await Branch.findOne({
        company: req.params.company,
        _id: req.params.id,
    });
    if (!branch) {
        return res
            .status(404)
            .send({ error_en: "Branch not found !" });
    }
    //III:must the name branch be unique
    // a7a ya abdo branch unique with name not the id
    const uniqueBranch = await Branch.findOne({
        company: req.params.company as string,
        name: req.body.name as string,
    });
    if (uniqueBranch) {
        return res
            .status(409)
            .send({ error_en: "The branch with the given ID used before" });
    }
    await Branch.updateOne(
        {
            company: req.params.company,
            _id: req.params.id,
        },
        {
            $set: {
                name: name.toLowerCase(),
                location: {
                    lat: lat ? lat : branch.location.lat,
                    long: long ? long : branch.location?.long,
                },
            },
            $push: {
                fixedHolidays:
                    fixedHolidays &&
                    fixedHolidays.map((days: Array<Date>) =>
                    {
                        return days;
                    }),
            },
        },
    );
    const newBranch = await Branch.findOne({
        company: req.params.company as string,
        _id: req.params.id as string,
    });
    res.send({
        success: true,
        data: newBranch,
        message_en: "Branch updated successfully",
    });
};
//@desc         delete a branch
//@route        DELETE /api/v1/branch/:company/:id
//@access       private(root)
export const deleteBranch = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        const branch = await Branch.findOne({
            company: req.params.company,
            _id: req.params.id,
        });
        if (!branch) {
            return res.status(404).send({
                error_en: "Branch not found !",
                error_ar: "فرع غير صالح !!",
            });
        }

        await Promise.all([
            Department.deleteMany({ branch: req.params.id }),
            Shift.deleteMany({ branch: req.params.id }),
            Attendance.deleteMany({ branch: req.params.id }),
            Request.deleteMany({ branch: req.params.id }),
            Payroll.deleteMany({ branch: req.params.id }),
            Contract.deleteMany({ branch: req.params.id }),
            Branch.deleteMany({ _id: req.params.id }),
            User.deleteMany({ branch: req.params.id }),
            Task.deleteMany({ branch: req.params.id }),
        ]);

        res.send({
            success: true,
            message_en: "Branch deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error_en: "An error occurred while deleting the branch",
            error_ar: "حدث خطأ أثناء حذف الفرع",
        });
    }
};