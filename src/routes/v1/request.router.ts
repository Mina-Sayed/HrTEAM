import {
  getAllAlerts,
  getAllReceive,
  getAllSend,
} from './../../controllers/request/request.controller'
import { checkSubscripe } from './../../middlewares/subscription'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import { checkRole } from '../../middlewares/acsses'
import { Router } from 'express'
import { Roles } from '../../types/enums'
import { validator } from '../../middlewares/validate'
import {
  addRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from '../../controllers/request/request.controller'
import { validateRequest } from '../../validators/request.validator'
import { AuthuthrationRequest } from '../../middlewares/authuthrations/request.authuthration'
const router: Router = Router()
// all(AuthenticationMiddleware, AuthuthrationRequest('request'), checkRole(Roles.ROOT), validator())

// create Request
router
  .route('/')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(AuthuthrationRequest('request', 'all'), getAllRequests)
  .post(
    validator(validateRequest, 'post'),
    AuthuthrationRequest('request', 'post'),
    addRequest,
  )
router
  .route('/alerts')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(AuthuthrationRequest('request', 'all'), getAllAlerts)
router
  .route('/recevie')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(AuthuthrationRequest('request', 'all'), getAllReceive)
router
  .route('/send')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
  )
  .get(AuthuthrationRequest('request', 'all'), getAllSend)
router
  .route('/:id')
  .all(
    AuthenticationMiddleware,
    checkSubscripe,
    AuthuthrationRequest('request', 'get'),
  )
  .get(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), getRequestById)
  .put(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), updateRequest)
  .delete(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), deleteRequest)

export default router
