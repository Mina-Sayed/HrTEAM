import { NextFunction, Request, Response } from "express";
export const validator =(validator:any, mode:any) => {
    return (req:Request, res:Response, next:NextFunction) => {
        console.log(mode)
        const { error } = validator(req.body, mode);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    }
}
