import { authBreakOver } from "../../middlewares/authorization/break_overTime.authorization";
import {
    updateBreak,
    getBreakById,
} from "../../controllers/break/break.controller";
import {
    addBreak,
    deleteBreakById,
    getAllBreaks,
    unassignUser,
    assignUser,
} from "../../controllers/break/break.controller";
import { Roles } from "../../types/enums";
import { checkRole } from "../../middlewares/access";
import { checkSubscribe } from "../../middlewares/subscription";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { validator } from "../../middlewares/validator";
import { validateBreak } from "../../validators/break.validator";


const router: Router = Router();
// Add a new break
router
    .route("/")
    .all(
        authMiddleware,
        authBreakOver("break"),
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN),
    )
    .post(validator(validateBreak, "post"), addBreak);

// Get all breaks in shift
router
    .route("/:shift")
    .all(
        authMiddleware,
        authBreakOver("break"),
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    )
    .get(getAllBreaks);

// (GET , PUT , DELETE) break by ID break
router
    .route("/:shift/:id")
    .all(
        authMiddleware,
        authBreakOver("break"),
        checkSubscribe,
    )
    .put(
        checkRole(Roles.ROOT, Roles.ADMIN),
        validator(validateBreak, "put"),
        updateBreak,
    )
    .get(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), getBreakById)
    .delete(checkRole(Roles.ROOT, Roles.ADMIN), deleteBreakById);

// assign user to break by shift and id break and userId in Body
router
    .route("/assignUser/:shift/:id")
    .all(
        authMiddleware,
        authBreakOver("break"),
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN),
    )
    .post(assignUser);
// unassign user from break by shift and id break and userId in Body
router
    .route("/unassign/:shift/:id")
    .all(
        authMiddleware,
        authBreakOver("break"),
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN),
    )
    .post(unassignUser);
export default router;
