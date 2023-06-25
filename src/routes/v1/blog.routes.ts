import { validator } from './../../middlewares/validate'
import { checkRole } from './../../middlewares/acsses'
import { Roles } from './../../types/enums'
import { Router } from 'express'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import {
  addBlog,
  addLike,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  MyBlog,
  removeLike,
  updateBlog,
} from '../../controllers/blog/blog.controller'
import { blogValidation } from '../../models/blog.model'

const router: Router = Router()

router
  .route('/')
  .all(
    AuthenticationMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
  )
  .get(getAllBlogs)
  .post(validator(blogValidation, 'post'), addBlog)
  
router
.route('/me')
.all(
  AuthenticationMiddleware,
)
.get(MyBlog)
router
  .route('/:id')
  .all(AuthenticationMiddleware)
  .get(checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), getBlogById)
  .put(checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), updateBlog)
  .delete(checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), deleteBlog)
router
  .route('/addLike/:blogId')
  .put(AuthenticationMiddleware, validator(blogValidation, 'put'), addLike)
router.route('/removeLike/:blogId').put(AuthenticationMiddleware, removeLike)
export default router
