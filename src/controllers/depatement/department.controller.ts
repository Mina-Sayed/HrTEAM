import { Roles } from "../../types/enums";
import { Branch } from "../../models/branch";
import { NextFunction, Request, Response } from "express";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Company } from "../../models/company";
import { Department } from "../../models/department";
import User from "../../models/user";
import Payroll from "../../models/payroll";
import Contract from "../../models/contract";
//@desc         create a Department
//@route        POST /api/v1/department
//@access       private(root)
export const addDepartment = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const {
        name,
        branch,
    } = req.body;
    // IV:must the name department be unique
    const uniqueDepartment = await Department.findOne({
        branch: branch,
        name: name,
    });
    if (uniqueDepartment) {
        return res
            .status(400)
            .send({ error_en: "The department already exists in the company" });
    }
    const department = new Department({
        name: name,
        branch: branch,
    });
    await department.save();
    res.status(201).send({
        success: true,
        department: department,
        message_en: "Department created successfully",
    });
};
//@desc         update a Department
//@route        PUT /api/v1/department/:branch/:name
//@access       private(root)
export const updateDepartment = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const { name } = req.body;
    console.log(req.params.branch);
    console.log(req.params.id);

    //II:check if the department found with company
    const department = await Department.findOne({
        branch: req.params.branch,
        _id: req.params.id,
    });

    if (!department) {
        return res.status(404).send({ error_en: "Department not found !" });
    }
    //III:must the name department be unique
    const uniqueDepartment = await Department.findOne({
        _id: { $ne: req.params.id },
        branch: req.params.branch,
        name: name,
    });
    if (uniqueDepartment) {
        return res
            .status(400)
            .send({ error_en: "Department already exists !" });
    }
    await Department.updateOne(
        {
            _id: req.params.id,
            branch: req.params.branch,
        },
        {
            $set: {
                name: name,
            },
        },
    );
    const newDepartment = await Department.findById(req.params.id);
    res.send({
        success: true,
        data: newDepartment,
        message_en: "Department updated successfully",
    });
};
//@desc         get all Departments
//@route        GET /api/v1/department/:branch
//@access       private(root)
//: a7a ya abdo
// : aya ya abdo tany Department.find({department})
//CHECK ROLE OF THE USER LOGGED IN IF EMPLOYEE RETURN THE DEPARTMENT THAT HE WORKS AT ELSE RETURN ALL
export const getAllDepartment = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    let departments;
    if (Roles.EMPLOYEE === req.user?.role) {
        departments = await Department.find({ _id: req.user?.department });
        // console.log('departments: ', departments)
    } else {
        departments = await Department.find({ branch: req.params.branch });
    }
    res.send({
        success: true,
        data: departments,
        message_en: "Departments fetched successfully",
    });
};
//@desc         get a Department
//@route        GET /api/v1/department/:branch/:name
//@access       private(root)
export const getDepartment = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    //II:check the department found with company
    const department = await Department.findOne({
        branch: req.params.branch,
        _id: req.params.id,
    });
    if (!department) {
        return res.status(404).send({ error_en: "Department not found !" });
    }
    res.send({
        success: true,
        data: department,
        message_en: "Department fetched successfully",
    });
};
//@desc         Delete a Department
//@route        DELETE /api/v1/department/:branch/:name
//@access       private(root)
// a7a ya abdo :: where the hell is the fucking delete for the department 
export const deleteDepartment = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const department = await Department.findOne({
        branch: req.params.branch,
        _id: req.params.id,
    });
    if (!department) {
        return res.status(404).send({ error_en: "Department not found !" });
    } else {
        await Department.findByIdAndDelete(department?._id);
    }

    await User.updateMany(
        {
            department: req.params.id,
        },
        {
            $set: {
                department: null,
            },
        },
    );
    await Contract.updateMany(
        {
            department: req.params.id,
        },
        {
            $set: {
                department: null,
            },
        },
    );
    await Payroll.deleteMany(
        {
            data: req.params.id,
        },
    );

    res.send({
        success: true,
        message_en: "Department deleted successfully",
    });
};
