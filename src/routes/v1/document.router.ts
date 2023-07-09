import {
  addDocument,
  deleteDocument,
  getDocumentUser,
} from './../../controllers/user/documents.controller'
import { Router } from 'express'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import { checkSubscripe } from '../../middlewares/subscription'
const router: Router = Router()
router
  .route('/')
  .all(AuthenticationMiddleware, checkSubscripe)
  .post(addDocument)
  .get(getDocumentUser)
router
  .route('/:id')
  .all(AuthenticationMiddleware, checkSubscripe)
  .delete(deleteDocument)
export default router
