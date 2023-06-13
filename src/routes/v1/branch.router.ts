import {
  authBranch,
} from "../../middlewares/authorization/branch.authorization";
import {
  deleteBranch,
  getAllBranches,
  getAllBranchesWithData,
  getBranch,
  updateBranch,
} from "../../controllers/branch/branch.controller";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import { checkRole } from "../../middlewares/access";
import {
  validateBranch,
} from "../../validators/branch.validator";
import {
  addBranch,
} from "../../controllers/branch/branch.controller";
import {
  checkSubscribe,
} from "../../middlewares/subscription";


const router: Router = Router();
// a7a ya abdo : branch can be deleted by admin and root
router
  .route("/:company?")
  .all(authMiddleware, authBranch("branch"), checkSubscribe, checkRole(Roles.ROOT, Roles.ADMIN))
  .post(validator(validateBranch, "post"), addBranch);

router
  .route("/:company")
  .all(authMiddleware, authBranch("branch"), checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE))
  .get(getAllBranches);
router
  .route("/data/:company")
  .all(authMiddleware, authBranch("branch"), checkSubscribe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE))
  .get(getAllBranchesWithData);
router
  .route("/:company/:id")
  .all(authMiddleware, authBranch("branch"), checkSubscribe)
  .get(checkRole(Roles.ROOT, Roles.EMPLOYEE, Roles.ADMIN), getBranch)
  .put(validator(validateBranch, "put"), checkRole(Roles.ROOT, Roles.ADMIN), updateBranch)
  .delete(checkRole(Roles.ROOT, Roles.ADMIN), deleteBranch);
export default router;
