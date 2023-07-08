import { Router } from "express";
import { createPackage, deletePackage, getAllPackages, getPackageById, updatePackage } from "../../controllers/packages";
import { checkRole } from "../../middlewares/acsses";
import { AuthenticationMiddleware } from "../../middlewares/auth";
import { validator } from "../../middlewares/validate";
import { Roles } from "../../types/enums";
import validatePackage from "../../validators/packageValidator";

const packageRouter = Router();

packageRouter.route('/')
    .get(getAllPackages)
    .post(AuthenticationMiddleware,
            checkRole(Roles.SUPER_ADMIN),
            createPackage);

packageRouter.route('/:id')
    .get(getPackageById)
    .all(AuthenticationMiddleware,
        checkRole(Roles.SUPER_ADMIN))
    .put( updatePackage)
    .delete(deletePackage);

export default packageRouter;

