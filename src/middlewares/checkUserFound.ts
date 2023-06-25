import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/User";

const checkUserFound = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.id)

    console.log(new mongoose.Types.ObjectId(req.params.id))
    let user = await User.findOne({ email: req.body.email, _id: { $ne: new mongoose.Types.ObjectId(req.params.id) } });
    console.log(user)
    if (user !== null) return res.status(400).send('User already registered.');
    next();
}

export default checkUserFound;