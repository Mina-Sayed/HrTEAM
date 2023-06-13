import { NextFunction, Response } from "express";
import { AuthenticatedReq } from "../auth";
import { Company } from "../../models/company";
import User from "../../models/user";


export const authCompany = (type: string, mode?: string) =>
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
    const companies: any = await Company.find({ owner: owner });
    //Obtaining a branch to compare the company's branch between the companies that own to owner
    if (type === "company") {
      if (!companies[0] && !req.params.name) {
        return res
          .status(404)
          .send({ error_en: "You don't have any company for now.." });
      }
    }
    next();
  };
