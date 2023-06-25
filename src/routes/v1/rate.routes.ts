import {
    getRateMonth,
  qurterRate,
  rateSincecontract,
} from './../../controllers/rate.controller'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Roles } from './../../types/enums'
import { checkRole } from './../../middlewares/acsses'
import { Router } from 'express'
import { getRateData } from '../../helpers/getRateData.helper'
const router: Router = Router()
router
  .route('/:userId')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
  )
  .get(rateSincecontract)
router
  .route('/month/:userId')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
  )
  .get(getRateMonth)
router
  .route('/quarter/:userId')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
  )
  .get(qurterRate)
export default router
