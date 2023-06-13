import {
    getOneYearOfUserPayroll,
    getPayrollEmployee,
    getPayrollByDepartment,
} from "../../controllers/payroll/payroll.controller";
import { checkSubscribe } from "../../middlewares/subscription";
import { Roles } from "../../types/enums";
import { checkRole } from "../../middlewares/access";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import {
    getAllPayRolls,
    getPayrollById,
} from "../../controllers/payroll/payroll.controller";


const router = Router();
router
    .route("/:id")
    .all(
        authMiddleware,
        checkSubscribe,
        checkRole(Roles.EMPLOYEE, Roles.ROOT, Roles.ADMIN),
    )
    .get(getPayrollById);
router
    .route("/shift/:branch")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
        checkSubscribe,
    )
    .get(getAllPayRolls);
router
    .route("/employee")
    .all(
        authMiddleware,
        checkRole(Roles.EMPLOYEE),
        checkSubscribe,
    )
    .get(getPayrollEmployee);
router
    .route("/department")
    .all(
        authMiddleware,
        checkSubscribe,
        checkRole(Roles.EMPLOYEE, Roles.ROOT, Roles.ADMIN),
    )
    .get(getPayrollByDepartment);

router.route("/yearly/:userId").get(authMiddleware, checkRole(Roles.ADMIN, Roles.EMPLOYEE, Roles.ROOT),
    getOneYearOfUserPayroll);
export default router;
