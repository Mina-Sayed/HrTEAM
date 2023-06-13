import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/user";

const checkUserFound = async (req: Request, res: Response, next: NextFunction) => {
  const { email, id } = req.body;
  const userId = new mongoose.Types.ObjectId(id);

  try {
    const user = await User.findOne({ email, _id: { $ne: userId } });
    if (user) {
      return res.status(400).send("User already registered.");
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

export default checkUserFound;