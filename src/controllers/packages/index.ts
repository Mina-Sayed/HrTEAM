import {Request, Response, NextFunction} from "express";
import {AuthenticatedReq} from "../../middlewares/auth";
import Package from "../../models/package";

//@desc         get all packages
//@route        GET /api/v1/packages
//@access       public
export const getAllPackages = async (req: Request, res: Response, next: NextFunction) =>
{
    const allPackages = await Package.find({});
    res.send({
        success: true,
        data: allPackages,
        message: 'packages are fetched successfully'
    });
};

//@desc         get package by id
//@route        GET /api/v1/packages
//@access       public
export const getPackageById = async (req: Request, res: Response, next: NextFunction) =>
{
    const packageFetched = await Package.findById(req.params.id);
    res.send({
        success: true,
        data: packageFetched,
        message: 'package is fetched successfully'
    });
};

//@desc         create a package
//@route        POST /api/v1/packages
//@access       private(super admin)
export const createPackage = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    const createdPackage = await Package.create(req.body);
    res.status(201).send({
        success: true,
        data: createdPackage,
        message: 'package is created successfully'
    });
};

//@desc         update a package
//@route        PATCH /api/v1/packages/:id
//@access       private(super admin)
export const updatePackage = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    const createdPackage = await Package.create(req.body);
    res.send({
        success: true,
        data: createdPackage,
        message: 'package is updated successfully'
    });
};

//@desc         delete a package
//@route        DELETE /api/v1/packages/:id
//@access       private(super admin)
export const deletePackage = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    await Package.findByIdAndRemove(req.params.id);
    res.status(204).send({
        success: true,
        message: 'package is deleted successfully'
    });
};