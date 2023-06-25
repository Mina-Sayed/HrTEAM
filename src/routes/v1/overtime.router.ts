import { AuthuthrationBreakOver } from './../../middlewares/authuthrations/break_overTime.authuthration';
import { addOverTime, assginUser, deleteOvertimeById, getAllOverTimeByShift, getOverTimeById, unassignUser, updateOverTime } from '../../controllers/overTime/overtime.controller'
import { validator } from '../../middlewares/validate'
import { Roles } from '../../types/enums'
import { checkRole } from '../../middlewares/acsses'
import { checkSubscripe } from '../../middlewares/subscription'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import { Router } from 'express'
import { validateOvertime } from '../../validators/overtime.validator'
const router: Router = Router()
router
  .route('/')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBreakOver('overtime'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(validator(validateOvertime, 'post'), addOverTime)
router
  .route('/:shift')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBreakOver('overtime'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN ,Roles.EMPLOYEE),
  )
  .get(getAllOverTimeByShift)

// (GET , PUT , DELETE) overtime by ID overtime
router
  .route('/:shift/:id')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBreakOver('overtime'),
    checkSubscripe,
  )
  .put(
    checkRole(Roles.ROOT, Roles.ADMIN),
    validator(validateOvertime, 'put'),
    updateOverTime,
  )
  .get(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), getOverTimeById)
  .delete(checkRole(Roles.ROOT, Roles.ADMIN),deleteOvertimeById)

// assign user to overTime by shift and id overtime and userId in Body
router
  .route('/assignUser/:shift/:id')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBreakOver('overtime'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(assginUser)
// unassign user from overtime by shift and id overtime and userId in Body
router
  .route('/unassign/:shift/:id')
  .all(
    AuthenticationMiddleware,
    AuthuthrationBreakOver('overtime'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(unassignUser)
export default router
