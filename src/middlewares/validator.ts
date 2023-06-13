import { NextFunction, Request, Response } from "express";


export const validator = (validator: any, mode: any) =>
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        const validationResult = validator(req.body, mode);
        if (!validationResult || !validationResult.error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request !",
            });
        }
        next();
    };
};
