import { validator } from './../../middlewares/validate'
import { Roles } from './../../types/enums'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Router, Response, Request, NextFunction } from 'express'
import { checkRole } from '../../middlewares/acsses'
import { checkSubscripe } from '../../middlewares/subscription'
import { AuthuthrationCategory } from '../../middlewares/authuthrations/category.authuthration'
import {
  addCategory,
  getAllCategory,
  UpdateCategory,
  DeleteCategory,
  getCategoryById,
} from '../../controllers/category/category.controller'
import { validateCategory } from '../../validators/category.validtor'
const router: Router = Router()

// .all(AuthenticationMiddleware, AuthuthrationCategory('subCategory'), checkSubscripe, checkRole(Roles.ROOT))
router
  .route('/')
  .all(AuthenticationMiddleware ,checkSubscripe)
  .post(
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN),
    validator(validateCategory, 'post'),
    AuthuthrationCategory('category', 'post'),
    addCategory,
  )
  .get(
    AuthuthrationCategory('category', 'get'),
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN, Roles.EMPLOYEE),
    getAllCategory,
  )
router.route('/')

router
  .route('/:id')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN),
  )
  .get(
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.SUPER_ADMIN, Roles.EMPLOYEE),
    AuthuthrationCategory('category', 'get'),
    getCategoryById,
  )
  .put(AuthuthrationCategory('category', 'put'), UpdateCategory)
  .delete(AuthuthrationCategory('category', 'delete'), DeleteCategory)
export default router
