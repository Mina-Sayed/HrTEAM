import { AuthuthrationBreakOver } from './../../middlewares/authuthrations/break_overTime.authuthration';
import {
  updateBreak,
  getBreakById,
} from '../../controllers/break/break.controller'
import {
  addBreak,
  deleteBreakById,
  getAllBreaks,
  unassignUser,
  assignUser
} from '../../controllers/break/break.controller'
import { Roles } from '../../types/enums'
import { checkRole } from '../../middlewares/acsses'
import { checkSubscripe } from '../../middlewares/subscription'
import { Router } from 'express'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import { validator } from '../../middlewares/validate'
import { validateBreak } from '../../validators/break.validator'
const router: Router = Router()
// Add a new break
router
  .route('/')
  .all(
    AuthenticationMiddleware,
   AuthuthrationBreakOver('break'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(validator(validateBreak, 'post'), addBreak)

// Get all breaks in shift
router
  .route('/:shift')
  .all(
    AuthenticationMiddleware,
   AuthuthrationBreakOver('break'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
  )
  .get(getAllBreaks)

// (GET , PUT , DELETE) break by ID break
router
  .route('/:shift/:id')
  .all(
    AuthenticationMiddleware,
   AuthuthrationBreakOver('break'),
    checkSubscripe,
  )
  .put(
    checkRole(Roles.ROOT, Roles.ADMIN),
    validator(validateBreak, 'put'),
    updateBreak,
  )
  .get(checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE), getBreakById)
  .delete(checkRole(Roles.ROOT, Roles.ADMIN), deleteBreakById)

// assign user to break by shift and id break and userId in Body
router
  .route('/assignUser/:shift/:id')
  .all(
    AuthenticationMiddleware,
   AuthuthrationBreakOver('break'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(assignUser)
// unassign user from break by shift and id break and userId in Body
router
  .route('/unassign/:shift/:id')
  .all(
    AuthenticationMiddleware,
   AuthuthrationBreakOver('break'),
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN),
  )
  .post(unassignUser)
export default router
