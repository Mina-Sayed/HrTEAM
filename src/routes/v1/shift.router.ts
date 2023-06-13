import { authShiftDepartment } from "../../middlewares/authorization/shift.authorization";
import {
  addShift,
  getAllShifts,
  getShift,
  addHolidays,
  addWorkDays,
  updateShift,
  deleteShift,
} from "../../controllers/shifts/shift.controller";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import { checkRole } from "../../middlewares/access";
import { checkSubscribe } from "../../middlewares/subscription";
import { validateShift } from "../../validators/shift.validators";


const router: Router = Router();
router
  .route("")
  .all(
    authMiddleware,
    checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(
    validator(validateShift, "post"),
    authShiftDepartment("shift"),
    addShift,
  );
router
  .route("/:branch")
  .all(
    authMiddleware,
    authShiftDepartment("shift"),
    checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(getAllShifts);
router
  .route("/:branch/:id")
  .all(
    authMiddleware,
    checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .get(authShiftDepartment("shift"), getShift)
  .put(
    authShiftDepartment("shift"),
    validator(validateShift, "put"),
    updateShift,
  )
  .delete(deleteShift);
router
  .route("holidays/:branch/:id")
  .all(
    authMiddleware,
    authShiftDepartment("shift"),
    checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(addHolidays);
router
  .route("workdays/:branch/:id")
  .all(
    authMiddleware,
    authShiftDepartment("shift"),
    checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(addWorkDays);
export default router;
