import { NextFunction, Request, Response } from "express";


export enum ReqTypes
{
    body = "body",
    query = "query",
}

export const validateData =
    (validationSchema: any, type: ReqTypes = ReqTypes.body) =>
        (req: Request, res: Response, next: NextFunction) =>
        {
            const result = validationSchema.validate(req[type]);

            if (result.error) {
                return res.status(400).json({
                    success: false,
                    message: result.error.details[0].message,
                });
            }

            req.body = result.value;

            next();
        };
