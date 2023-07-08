import { getOneYearOfUserPayrol, getPayrolEmployee, getPayrollsbyDepartment } from './../../controllers/payrol/payrol.controller';
import { checkCreationPrivilage } from './../../middlewares/checkPrivilages';
import { checkSubscripe } from './../../middlewares/subscription';
import { Roles } from './../../types/enums'
import { checkRole } from './../../middlewares/acsses'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Router } from 'express'
import { validator } from '../../middlewares/validate'
import {
  getAllPayRols,
  getPayrolById,
} from '../../controllers/payrol/payrol.controller'
const router = Router()
router
  .route('/shift/:branch')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
    checkSubscripe
  )
  .get(getAllPayRols)
router
  .route('/shift/employee')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.EMPLOYEE),
    checkSubscripe
  )
  .get(getPayrolEmployee)
router
  .route('/department')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.EMPLOYEE, Roles.ROOT, Roles.ADMIN),
  )
  .get(getPayrollsbyDepartment)
router
  .route('/:id')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.EMPLOYEE, Roles.ROOT, Roles.ADMIN),
  )
  .get(getPayrolById)

router.route('/yearly/:userId').
  get(AuthenticationMiddleware, checkRole(Roles.ADMIN, Roles.EMPLOYEE,Roles.ROOT), getOneYearOfUserPayrol)
export default router
