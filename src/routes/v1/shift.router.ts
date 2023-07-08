import { AuthuthrationShift_Department } from './../../middlewares/authuthrations/shift.authuthration'
import {
  addShift,
  getAllShifts,
  getShift,
  addHolidays,
  addWorkDays,
  updateShift,
  deleteShift,
} from './../../controllers/shifts/shift.controller'
import { validator } from './../../middlewares/validate'
import { Roles } from './../../types/enums'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Router, Response, Request, NextFunction } from 'express'
import { checkRole } from '../../middlewares/acsses'
import { checkSubscripe } from '../../middlewares/subscription'
import { validateShift } from '../../validators/shift.validators'
const router: Router = Router()
router
  .route('')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(
    validator(validateShift, 'post'),
    AuthuthrationShift_Department('shift'),
    addShift,
  )
router
  .route('/:branch')
  .all(
    AuthenticationMiddleware,
    AuthuthrationShift_Department('shift'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(getAllShifts)
router
  .route('/:branch/:id')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .get(AuthuthrationShift_Department('shift'), getShift)
  .put(
    AuthuthrationShift_Department('shift'),
    validator(validateShift, 'put'),
    updateShift,
  )
  .delete(deleteShift)
router
  .route('holidays/:branch/:id')
  .all(
    AuthenticationMiddleware,
    AuthuthrationShift_Department('shift'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(addHolidays)
router
  .route('workdays/:branch/:id')
  .all(
    AuthenticationMiddleware,
    AuthuthrationShift_Department('shift'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(addWorkDays)
export default router
