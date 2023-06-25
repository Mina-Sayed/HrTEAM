import { NextFunction, Request, Response } from "express";
import { AuthenticatedReq } from "./auth";
export const checkRole = (...roles: Array<any>) => (req: AuthenticatedReq, res: Response, next: NextFunction) => {

    console.log('the commingRoles; ', roles, req?.user?.role, req.originalUrl)


    console.log('userRole; ', req?.user?.role, !roles.includes((req as AuthenticatedReq).user!.role))
    if(!roles.includes(req?.user?.role)){

        return res.status(403).send('Access Forbidden!!');
    }
    else next()
    // if (!roles.includes((req as AuthenticatedReq).user!.role)) {

    // }
    
    // next();
}
