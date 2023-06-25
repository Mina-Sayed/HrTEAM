import { createUser } from './../../controllers/user/createUser';
import { validator } from './../../middlewares/validate';
import { Router } from 'express'
import login from '../../controllers/auth/login'
import { validateUserPost } from '../../validators/userValidator';

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/register', validator(validateUserPost, 'post'), createUser)

export default authRouter
