import {
    attend,
    getAllAttendanceForEmployee,
    getAllUsersAttendees,
    getAllCountForEveryYear,
    getAttendStatusToday,
} from "../../controllers/attendance.controller";
import { checkSubscribe } from "../../middlewares/subscription";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";


const router: Router = Router();
router.route("/").all(authMiddleware, checkSubscribe)
    .post(attend);
router
    .route("/employee/attend")
    .all(authMiddleware, checkSubscribe)
    .get(getAttendStatusToday);
router
    .route("/employee/attendees")
    .all(authMiddleware, checkSubscribe)
    .get(getAllAttendanceForEmployee);
router
    .route("/count")
    .all(authMiddleware, checkSubscribe)
    .get(getAllCountForEveryYear);
router
    .route("/attendees")
    .all(authMiddleware, checkSubscribe)
    .get(getAllUsersAttendees);
export default router;
