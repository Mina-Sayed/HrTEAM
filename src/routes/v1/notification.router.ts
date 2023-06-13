import {
  getNotificationAdminRoot,
  updateStatus,
} from "../../controllers/notifications/index.controller";
import { checkSubscribe } from "../../middlewares/subscription";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { getNotificationEmployee } from "../../controllers/notifications/index.controller";


const router: Router = Router();
router
  .route("/employee")
  .all(authMiddleware, checkSubscribe)
  .get(getNotificationEmployee);
router
  .route("/admin")
  .all(authMiddleware, checkSubscribe)
  .get(getNotificationAdminRoot);
router
  .route("/:id")
  .all(authMiddleware, checkSubscribe)
  .put(updateStatus);

export default router;
