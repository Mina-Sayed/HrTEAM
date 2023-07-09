import { AuthuthrationBranch } from './../../middlewares/authuthrations/branch.authuthration'
import {
  deleteBranch,
  getAllBranches,
  getAllBranchesWithData,
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
const router: Router = Router()
// a7a ya abdo : branch can be deleted by admin and root
router
  .route('/:company?')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBranch('branch'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(validator(validateBranch, 'post'), addBranch)

router
  .route('/:company')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBranch('branch'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(getAllBranches)
router
  .route('/data/:company')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBranch('branch'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(getAllBranchesWithData)
router
  .route('/:company/:id')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBranch('branch'),
    checkSubscripe,

  )
  .get(checkRole(Roles.ROOT, Roles.EMPLOYEE, Roles.ADMIN), getBranch)
  .put(validator(validateBranch, 'put'), checkRole(Roles.ROOT, Roles.ADMIN), updateBranch)
  .delete(checkRole(Roles.ROOT, Roles.ADMIN), deleteBranch)
export default router
