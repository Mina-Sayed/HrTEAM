import { NextFunction, Request, Response } from "express";
import { ErorrResponse } from "./errorResponse";


export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) =>
{
    console.log(err, "server error");
    let error: any;
    //Mongoose bad objectId
    if (err.name == "CastError") {
        const message = `the product not found with id of ${ err.value }`;
        error = new ErorrResponse(message,
            404);
    }
    //Error duplicate key
    if (err.code === 409) {
        const message = "Duplicate field value entered ";
        error = new ErorrResponse(message,
            409);
    }
    // Mongoose Validation Error "HttpErrorResponse"
    if (err.name == "ValidationError") {
        const message = Object.values(err.errors).map((val: any) => val.message);
        error = new ErorrResponse(message,
            400);
    }
    console.log(err);

    res.status(error?.statusCode || 500).send({
        success: false,
        error: error?.message || "SERVER ERROR",
    });
};