import {
  getNotifictionAdminRoot,
  updateStatus,
} from './../../controllers/notifications/index.controller'
import { checkSubscripe } from './../../middlewares/subscription'
import { Router } from 'express'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import { getNotifictionEmployee } from '../../controllers/notifications/index.controller'
const router: Router = Router()
router
  .route('/employee')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(getNotifictionEmployee)
router
  .route('/admin')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(getNotifictionAdminRoot)
router
  .route('/:id')
  .all(AuthenticationMiddleware, checkSubscripe)
  .put(updateStatus)

export default router
