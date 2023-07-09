import { NextFunction, Request, Response } from "express";
import User, { UserI } from "../models/User";
import jwt from 'jsonwebtoken';

export interface AuthenticatedReq extends Request {
    user?: UserI
}

export const AuthenticationMiddleware = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        //Get Token From Header Of Request And Check If Token Is Exist
        const token: string | undefined = req.header("Authentication");
        if (!token) return res.status(401).send({ error_en: "Access Denied!!" });
        //decoded Token And Find In Mongoo db By id Then CHeck If user Exist
        const decoded: any = jwt.verify(token, process.env.JWT_KEY!);
        const user = await User.findById(decoded._id);
        if (!user) return res.send("Invalid Token");
        // Set Current User To locals
        (req as AuthenticatedReq).user = user;
        // call next Middleware
        return next();
    } catch (ex) {
        return res.status(400).send("");
    }
};