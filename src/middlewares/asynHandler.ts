import { Response, NextFunction } from "express";
import { AuthenticatedReq } from "./auth";


export const asyncHandler = (fn: any) => (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};