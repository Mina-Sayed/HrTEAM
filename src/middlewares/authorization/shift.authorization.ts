import { Branch } from "../../models/branch";
import { NextFunction, Response } from "express";
import User from "../../models/user";
import { AuthenticatedReq } from "../auth";
import { Company } from "../../models/company";


export const authShiftDepartment = (type: string, mode?: string) =>
    async function (req: AuthenticatedReq, res: Response, next: NextFunction)
    {
        //Obtaining user to know who is owner
        const user: any = await User.findOne({ _id: req.user?._id });
        let owner;
        // If the user is a root, he gets his companies
        if (user.role === "root") {
            owner = user._id;
        }
        // If the user is an admin, he gets his owner and gets his companies
        else if (user.role === "admin") {
            const company: any = await Company.findOne({ _id: user.company });
            owner = company.owner;
        }
        // If the user is an employee, he gets his owner and gets his companies
        else if (user.role === "employee") {
            const company: any = await Company.findOne({ _id: user.company });
            owner = company.owner;
        }
        //Obtaining companies owner
        const companiesId: any = (
            await Company.find({ owner: owner })
        ).map((company) => company._id.toString());
        //Obtaining a branch to compare the company's branch between the companies that own to owner
        const branch: any = await Branch.findOne({
            _id: req.body.branch ? req.body.branch : req.params.branch,
        });

        if (type === "departement" || type === "shift") {
            if (!branch) {
                return res.status(400).send({ error_en: "Invalid Brnach" });
            }

            if (branch && !companiesId.includes(branch.company.toString())) {
                return res.status(401).send({
                    error_en: `You cannot (add or update or get) any ${ type } in this branch because you are not the owner of the company has this branch`,
                });
            }
        }
        next();
    };
