import { Router } from "express";
import {
    createPackage,
    deletePackage,
    getAllPackages,
    getPackageById,
    updatePackage,
} from "../../controllers/packages";
import { checkRole } from "../../middlewares/access";
import { authMiddleware } from "../../middlewares/auth";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import validatePackage from "../../validators/package.validator";


const packageRouter = Router();

packageRouter.route("/")
    .get(getAllPackages)
    .post(authMiddleware,
        checkRole(Roles.SUPER_ADMIN),
        validator(validatePackage, "post"),
        createPackage);

packageRouter.route("/:id")
    .get(getPackageById)
    .all(authMiddleware,
        checkRole(Roles.SUPER_ADMIN))
    .put(validator(validatePackage, "put"), updatePackage)
    .delete(deletePackage);

export default packageRouter;

