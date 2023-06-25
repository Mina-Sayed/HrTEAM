import { AuthuthrationShift_Department } from './../../middlewares/authuthrations/shift.authuthration'
import {
  addDepartment,
  delteDepartment,
  getAllDepartment,
  getDepartment,
  updateDepartment,
} from './../../controllers/depatement/department.controller'
import {
  getAllBranches,
  getBranch,
  updateBranch,
} from './../../controllers/branch/branch.controller'
import { validator } from './../../middlewares/validate'
import { Roles } from './../../types/enums'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Router, Response, Request, NextFunction } from 'express'
import { checkRole } from '../../middlewares/acsses'
import { validateBranch } from '../../validators/branch.validator'
import { addBranch } from '../../controllers/branch/branch.controller'
import { checkSubscripe } from '../../middlewares/subscription'
import { validateDepartment } from '../../models/Department'
const router: Router = Router()
// a7a ya abdo :: admin can add branch as well
router
  .route('/')
  .all(AuthenticationMiddleware, checkSubscripe, checkRole(Roles.ROOT, Roles.ADMIN))
  .post(
    validator(validateDepartment, 'post'),
    AuthuthrationShift_Department('departement'),
    addDepartment,
  )

router
  .route('/:branch')
  .all(
    AuthenticationMiddleware,
    AuthuthrationShift_Department('departement'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(getAllDepartment)
// a7a ya abdo :: both root and admin have the same access to the company
router
  .route('/:branch/:id')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(AuthuthrationShift_Department('departement'), checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), getDepartment)
  .put(
    AuthuthrationShift_Department('departement'),
    checkRole(Roles.ROOT, Roles.ADMIN),
    validator(validateDepartment, 'put'),
    updateDepartment,
  )
  .delete(checkRole(Roles.ROOT, Roles.ADMIN), delteDepartment)
export default router
