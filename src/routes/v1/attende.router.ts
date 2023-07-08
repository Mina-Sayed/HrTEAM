import {
  attend,
  getAllAttendforEmployee,
  getAllAttendforUsers,
  getAllCountForEveryYear,
  getStatusAttendToday,
} from './../../controllers/attendenc.controller'
import { checkSubscripe } from './../../middlewares/subscription'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import { AuthuthrationMiddleware } from '../../middlewares/authuthration'
import { checkRole } from '../../middlewares/acsses'
import { Router } from 'express'
import { Roles } from '../../types/enums'
import { validator } from '../../middlewares/validate'
const router: Router = Router()
router.route('/').all(AuthenticationMiddleware, checkSubscripe).post(attend)
router
  .route('/employee/attend')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(getStatusAttendToday)
router
  .route('/employee/attends')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(getAllAttendforEmployee)
router
  .route('/count')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(getAllCountForEveryYear)
router
  .route('/attends')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(getAllAttendforUsers)
export default router
