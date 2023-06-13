import { authShiftDepartment } from "../../middlewares/authorization/shift.authorization";
import {
  addDepartment,
  deleteDepartment,
  getAllDepartment,
  getDepartment,
  updateDepartment,
} from "../../controllers/depatement/department.controller";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import { checkRole } from "../../middlewares/access";
import { checkSubscribe } from "../../middlewares/subscription";
import { validateDepartment } from "../../models/department";


const router: Router = Router();
// a7a ya abdo :: admin can add branch as well
router
  .route("/")
  .all(authMiddleware, checkSubscribe, checkRole(Roles.ROOT, Roles.ADMIN))
  .post(
    validator(validateDepartment, "post"),
    authShiftDepartment("department"),
    addDepartment,
  );

router
  .route("/:branch")
  .all(
    authMiddleware,
    authShiftDepartment("department"),
    checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(getAllDepartment);
// a7a ya abdo :: both root and admin have the same access to the company
router
  .route("/:branch/:id")
  .all(authMiddleware, checkSubscribe)
  .get(authShiftDepartment("department"), checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    getDepartment)
  .put(
    authShiftDepartment("department"),
    checkRole(Roles.ROOT, Roles.ADMIN),
    validator(validateDepartment, "put"),
    updateDepartment,
  )
  .delete(checkRole(Roles.ROOT, Roles.ADMIN), deleteDepartment);
export default router;
