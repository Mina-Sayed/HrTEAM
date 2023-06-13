import { validator } from "../../middlewares/validator";
import { checkRole } from "../../middlewares/access";
import { Roles } from "../../types/enums";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  addBlog,
  addLike,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  MyBlog,
  removeLike,
  updateBlog,
} from "../../controllers/blog/blog.controller";
import { blogValidator } from "../../validators/blog.validator";


const router: Router = Router();

router
  .route("/")
  .all(
    authMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
  )
  .get(getAllBlogs)
  .post(validator(blogValidator, "post"), addBlog);

router
  .route("/me")
  .all(
    authMiddleware,
  )
  .get(MyBlog);
router
  .route("/:id")
  .all(authMiddleware)
  .get(checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), getBlogById)
  .put(checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), updateBlog)
  .delete(checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), deleteBlog);
router
  .route("/addLike/:blogId")
  .put(authMiddleware, validator(blogValidator, "put"), addLike);
router.route("/removeLike/:blogId").put(authMiddleware, removeLike);
export default router;
