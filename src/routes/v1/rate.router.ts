import {
    getRateMonth,
    qurterRate,
    rateSincecontract,
} from "../../controllers/rate.controller";
import { authMiddleware } from "../../middlewares/auth";
import { Roles } from "../../types/enums";
import { checkRole } from "../../middlewares/access";
import { Router } from "express";


const router: Router = Router();
router
    .route("/:userId")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
    )
    .get(rateSincecontract);
router
    .route("/month/:userId")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
    )
    .get(getRateMonth);
router
    .route("/quarter/:userId")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
    )
    .get(qurterRate);
export default router;
