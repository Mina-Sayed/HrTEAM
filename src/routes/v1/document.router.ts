import {
    addDocument,
    deleteDocument,
    getDocumentUser,
} from './../../controllers/user/documents.controller';
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { checkSubscribe } from '../../middlewares/subscription';


const router: Router = Router();
router
    .route('/')
    .all(authMiddleware, checkSubscribe)
    .post(addDocument)
    .get(getDocumentUser);
router
    .route('/:id')
    .all(authMiddleware, checkSubscribe)
    .delete(deleteDocument);
export default router;
