import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Roles } from "../../types/enums";
import Subscription from "../../models/subscription";

//@desc         create superadmin
//@route        POST /api/v1/users/superadmins
//@access       private(super admins)
export const createSuperAdmin = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const createdUser = await User.create({
            ...req.body,
            role: Roles.SUPER_ADMIN,
        });

        res.status(201).json({
            success: true,
            message: "Super admin created successfully",
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
};


//@desc         create root
//@route        POST /api/v1/users/roots
//@access       private(super admins)
export const createRoot = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        const existingRoot = await User.findOne({ role: Roles.ROOT });

        if (existingRoot) {
            return res.status(409).send({ error_en: "A root user already exists" });
        }

        if (!req.body.package) {
            return res.status(400).send({ error_en: "The package is required to create a root user" });
        }

        const createdUser = new User({
            ...req.body,
            role: Roles.ROOT,
        });

        const userSubscriptions = new Subscription({
            subscriber: createdUser._id,
            package: req.body.package,
        });

        await createdUser.save();
        await userSubscriptions.save();

        res.status(201).json({
            success: true,
            message: "Root user created successfully",
            data: {
                createdUser,
                userSubscriptions,
            },
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


//@desc         get all admins
//@route        GET /api/v1/users/admins
//@access       private(admin, root)
export const createAdmin = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        const admin = await User.create({
            ...req.body,
            role: Roles.ADMIN,
        });
        return res.status(201).send({
            success: true,
            data: admin,
            message: "admin is created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while creating the admin",
        });
    }
};


//@desc         get all employees
//@route        GET /api/v1/users/employees
//@access       private(admin, root)
export const createEmployee = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        let employee;
        if (req.user?.role === Roles.ROOT) {
            employee = new User({
                ...req.body,
            });
        } else {
            employee = new User({
                ...req.body,
                role: Roles.EMPLOYEE,
            });
        }

        if (!req.body.shift) {
            return res.status(400).send({ error_en: "Please enter shift for employee" });
        }

        await employee.save();

        return res.status(201).send({
            success: true,
            data: employee,
            message: "Employee is created successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error_en: "Something went wrong" });
    }
};

//@desc         URL REGISTER EMPLOYEES
//@route        GET /api/v1/users/employees
//@access       private(admin, root)
// export const RegisterEmployee = async (req: Request, res: Response) => {
//     const Id = req.params.register

// }
//@desc         REGISTER
//@route        POST /api/v1/users/register
//@access       public
export const createUser = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    try {
        const user = new User({
            ...req.body,
            role: Roles.USER,
        });

        await user.save();

        const userWithoutPass = await User.findById(user._id).select("-password");

        return res.status(201).json({
            success: true,
            data: userWithoutPass,
            message: "Signup is successful",
        });
    } catch (error) {
        next(error);
    }
};

