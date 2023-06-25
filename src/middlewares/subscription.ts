import { NextFunction, Request, Response } from "express";
import { Company } from "../models/Company";
import Subscription from "../models/Subscription";
import { Roles } from "../types/enums";
import { AuthenticatedReq } from "./auth";
export const checkSubscripe = async (req: AuthenticatedReq, res: Response, next: NextFunction) => {
    let root;
    if (req.user!._id && req.user!.role === Roles.ROOT) {
        root = req.user!._id
    }
    else if (req.user!._id && req.user!.role === Roles.ADMIN) {
        let company = await Company.findOne({ _id: req.user!.company })
        root = company!.owner
    }
    else if (req.user!._id && req.user!.role === Roles.EMPLOYEE) {
        let company = await Company.findOne({ _id: req.user!.company })
        root = company!.owner
    }
    let subscribe = await Subscription.findOne({ subscriber: root })
    if (subscribe && (subscribe!.endDate < new Date(Date.now()) || subscribe!.isExpired)) return res.status(403).send('Access Forbidden!! , your subscription is expired');
    next();
}
