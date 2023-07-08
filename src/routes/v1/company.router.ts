import { AuthenticationMiddleware } from './../../middlewares/auth'

import { Response, Request, NextFunction, Router } from 'express'
import {
  addCompany,
  deleteCompanyById,
  getCompanyByName,
  getOwnerCompanies,
  updateCompanyByName,
} from '../../controllers/company/company.controller'
import { validator } from '../../middlewares/validate'
import { validateCompany } from '../../validators/company.validator'
import { checkRole } from '../../middlewares/acsses'
import { Roles } from '../../types/enums'
import { checkSubscripe } from '../../middlewares/subscription'
import { AuthuthrationCompany } from '../../middlewares/authuthrations/compnay.authuthration'
const router = Router()
router
  .route('/')
  .all(AuthenticationMiddleware, checkSubscripe, checkRole(Roles.ROOT))
  .post(validator(validateCompany, 'post'), addCompany)
  .get(AuthuthrationCompany('company'), getOwnerCompanies)
router
  .route('/:id')
  .all(AuthenticationMiddleware)
  .put(
    AuthuthrationCompany('company'),
    checkSubscripe,
    checkRole(Roles.ROOT),
    validator(validateCompany, 'put'),
    updateCompanyByName,
  )
  .get(
    AuthuthrationCompany('company'),
    checkRole(Roles.ROOT, Roles.ADMIN),
    getCompanyByName,
  ).delete(deleteCompanyById)
export default router
