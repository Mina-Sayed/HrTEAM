import { authBreakOver } from "../../middlewares/authorization/break_overTime.authorization";
import {
    addOverTime,
    assignUser,
    deleteOvertimeById,
    getAllOverTimeByShift,
    getOverTimeById,
    unassignUser,
    updateOverTime,
} from "../../controllers/overTime/overtime.controller";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import { checkRole } from "../../middlewares/access";
import { checkSubscribe } from "../../middlewares/subscription";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import { validateOvertime } from "../../validators/overtime.validator";


const router: Router = Router();
router
    .route("/")
    .all(
        authMiddleware,
        authBreakOver("overtime"),
        checkSubscribe,
        checkRole(Roles.ROOT,
            Roles.ADMIN),
    )
    .post(validator(validateOvertime,
            "post"),
        addOverTime);
router
    .route("/:shift")
    .all(
        authMiddleware,
        authBreakOver("overtime"),
        checkSubscribe,
        checkRole(Roles.ROOT,
            Roles.ADMIN,
            Roles.EMPLOYEE),
    )
    .get(getAllOverTimeByShift);

// (GET , PUT , DELETE) overtime by ID overtime
router
    .route("/:shift/:id")
    .all(
        authMiddleware,
        authBreakOver("overtime"),
        checkSubscribe,
    )
    .put(
        checkRole(Roles.ROOT,
            Roles.ADMIN),
        validator(validateOvertime,
            "put"),
        updateOverTime,
    )
    .get(checkRole(Roles.ROOT,
            Roles.ADMIN,
            Roles.EMPLOYEE),
        getOverTimeById)
    .delete(checkRole(Roles.ROOT,
            Roles.ADMIN),
        deleteOvertimeById);

// assign user to overTime by shift and id overtime and userId in Body
router
    .route("/assignUser/:shift/:id")
    .all(
        authMiddleware,
        authBreakOver("overtime"),
        checkSubscribe,
        checkRole(Roles.ROOT,
            Roles.ADMIN),
    )
    .post(assignUser);
// unassign user from overtime by shift and id overtime and userId in Body
router
    .route("/unassign/:shift/:id")
    .all(
        authMiddleware,
        authBreakOver("overtime"),
        checkSubscribe,
        checkRole(Roles.ROOT,
            Roles.ADMIN),
    )
    .post(unassignUser);
export default router;
