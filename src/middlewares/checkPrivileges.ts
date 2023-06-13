import { AuthenticatedReq } from "./auth";
import { Response, NextFunction } from "express";
import { Roles } from "../types/enums";
import { Company } from "../models/company";
import User from "../models/user";


export const checkUpdatePrivilege = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user === null) {
    return res.status(404).send({
      success: false,
      message: "user not found",
    });
  }
  // We need to check if root can add employees only to his companies
  if (req.user?.role === Roles.ROOT) {
    const company = await Company.findOne({
      owner: req.user._id,
      _id: user.company,
    });
    if (company === null) {
      return res.status(400).send({
        success: false,
        message: "employees can only be accessed in root's companies",
      });
    }
  }
  ;
  if (req.body.company === null) {
    return next();
  }

  // We need to check if this employee is in the same company
  if (req.user?.role === Roles.ADMIN && req.user.company !== req.body.company) {
    return res.status(400).send({
      success: false,
      message: "employees can only be accessed in the same company",
    });
  }
  ;


  next();
};

export const checkCreationPrivilage = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{

  // We need to check if root can add employees only to his companies
  if (req.user?.role === Roles.ROOT) {
    const company = await Company.findOne({
      owner: req.user._id,
      _id: req.body.company,
    });
    if (company === null) {
      return res.status(400).send({
        success: false,
        message: "employees can only be accessed in root's companies",
      });
    }
  }
  ;
  if (req.body.company === null) {
    return next();
  }

  // We need to check if this employee is in the same company
  if (req.user?.role === Roles.ADMIN && req.user.company !== req.body.company) {
    return res.status(400).send({
      success: false,
      message: 'employees can only be accessed in the same company'
    });
  }
  ;
  next();
};
