import { AuthuthrationTask } from './../../middlewares/authuthrations/task.authuthration';
import {
  assginTask,
  unassginTask,
} from './../../controllers/task/task.controller'
import { Roles } from './../../types/enums'
import { checkRole } from './../../middlewares/acsses'
import { AuthenticationMiddleware } from './../../middlewares/auth'
import { Router } from 'express'
import {
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTask,
} from '../../controllers/task/task.controller'
import { validator } from '../../middlewares/validate'
import { taskValidation } from '../../validators/task.validator'
import { checkSubscripe } from '../../middlewares/subscription'
const router = Router()
router
  .route('/')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
    checkSubscripe,
  )
  .get(AuthuthrationTask('task', 'all'), getAllTasks)
  .post(
    validator(taskValidation, 'post'),
    AuthuthrationTask('task', 'post'),
    addTask,
  )
 
router
  .route('/assgin/:id')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN),
    checkSubscripe,
  )
  .put(
    validator(taskValidation, 'put'),
    AuthuthrationTask('task', 'put'),
    assginTask,
  )
router
  .route('/unassgin/:id')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN),
    checkSubscripe,
  )
  .put(
    validator(taskValidation, 'put'),
    AuthuthrationTask('task', 'put'),
    unassginTask,
  )
router
  .route('/:id')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
    checkSubscripe,
  )
  .get(
    checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    AuthuthrationTask('task', 'put'),
    getTaskById,
  )
  .delete(
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
    AuthuthrationTask('task', 'delete'),
    deleteTask,
  )
  .put(
    checkRole(Roles.ROOT, Roles.ADMIN,Roles.EMPLOYEE),
    validator(taskValidation, 'put'),
    AuthuthrationTask('task', 'put'),
    updateTask,
  )

export default router
