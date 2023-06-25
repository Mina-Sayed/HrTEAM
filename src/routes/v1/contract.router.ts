import { AuthuthrationContract } from './../../middlewares/authuthrations/contract.authuthration';
import { checkSubscripe } from './../../middlewares/subscription'
import { Roles } from './../../types/enums'
import { checkRole } from './../../middlewares/acsses'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Router } from 'express'
import {
  getAllContract,
  addContract,
  updateContract,
  getContractById,
  deleteContract,
  toggelGetContract,
  getUserContract,
} from '../../controllers/contract/contract.controller'

import { validator } from '../../middlewares/validate'
import { ContractValidation } from '../../validators/contract.validator'
const router = Router()


router.route('/getContractByUser/:userId?').get(AuthenticationMiddleware, checkRole(Roles.ADMIN, Roles.EMPLOYEE, Roles.ROOT), getUserContract)

router
  .route('/')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN),
    checkSubscripe,
  )
  .post(
    validator(ContractValidation, 'post'),
    AuthuthrationContract('contract', 'post'),
    addContract,
  )
router
  .route('/all/filter/:company')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
    checkSubscripe,
  )
  .get(AuthuthrationContract('contract', 'get'), toggelGetContract)
router
  .route('/all/:company')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    checkSubscripe,
  )
  .get(AuthuthrationContract('contract', 'get'), getAllContract);

// a7a ya abdo you made the user to delete his contract
router
  .route('/:id')
  .all(AuthenticationMiddleware, checkSubscripe)
  .get(
    checkRole(Roles.ROOT, Roles.ADMIN),
    AuthuthrationContract('contract', 'get'),
    getContractById,
  )
  .put(
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    validator(ContractValidation, 'put'),
    AuthuthrationContract('contract', 'put'),
    updateContract,
  )
  .delete(AuthuthrationContract('contract', 'delete'), checkRole(Roles.ROOT, Roles.ADMIN), deleteContract)

export default router
