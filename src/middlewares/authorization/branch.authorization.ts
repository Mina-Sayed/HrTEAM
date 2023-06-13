import { NextFunction, Response } from "express";
import User from "../../models/user";
import { AuthenticatedReq } from "../auth";
import { Company } from "../../models/company";


export const authBranch = (type: string, mode?: string) =>
  async function (req: AuthenticatedReq, res: Response, next: NextFunction)
  {
    //Obtaining user to know who is owner
    const user: any = await User.findOne({ _id: req.user?._id });
    let owner;
    // If the user is a root, he gets his companies
    if (user.role === "root") {
      owner = user._id;
    }
      // If the user is an admin, he gets his owner and
      // gets
    // his companies
    else if (user.role === "admin") {
      const company: any = await Company.findOne({ _id: user.company });
      owner = company.owner;
    }
      // If the user is an employee, he gets his owner and
    // gets his companies
    else if (user.role === "employee") {
      const company: any = await Company.findOne({ _id: user.company });
      owner = company.owner;
    }
    //Data of body
    let { company } = req.body;
    if (type === "branch") {
      const companyValid = await Company.findOne({
        owner: owner,
        _id: company ? company : req.params.company,
      });
      if (!companyValid) {
        return res.status(401).send({
          error_en: "You cannot (add or update or get) any branch in this company because you are not the owner of the company",
        });
      }
    }
    next();
  };
