import { NextFunction, Response } from "express";
import { AuthenticatedReq } from "./auth";


export const checkRole = (...roles: string[]) =>
  (req: AuthenticatedReq, res: Response, next: NextFunction) =>
  {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      const requiredRoles = roles.join(", ");
      return res.status(403).json({
        message: `Access forbidden. Required role(s): ${ requiredRoles }. User role: ${ userRole }.`,
      });
    }

    next();
  };
