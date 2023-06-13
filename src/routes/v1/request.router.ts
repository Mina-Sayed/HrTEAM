import {
    getAllAlerts,
    getAllReceived,
    getAllSend,
} from "../../controllers/request/request.controller";
import { checkSubscribe } from "../../middlewares/subscription";
import { authMiddleware } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/access";
import { Router } from "express";
import { Roles } from "../../types/enums";
import { validator } from "../../middlewares/validator";
import {
    addRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
} from "../../controllers/request/request.controller";
import { validateRequest } from "../../validators/request.validator";
import { AuthuthrationRequest } from "../../middlewares/authorization/request.authorization";


const router: Router = Router();
// all(AuthenticationMiddleware, AuthuthrationRequest('request'), checkRole(Roles.ROOT), validator())

// create Request
router
    .route("/")
    .all(
        authMiddleware,
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    )
    .get(AuthuthrationRequest("request", "all"), getAllRequests)
    .post(
        validator(validateRequest, "post"),
        AuthuthrationRequest("request", "post"),
        addRequest,
    );
router
    .route("/alerts")
    .all(
        authMiddleware,
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    )
    .get(AuthuthrationRequest("request", "all"), getAllAlerts);
router
    .route("/recevie")
    .all(
        authMiddleware,
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    )
    .get(AuthuthrationRequest("request", "all"), getAllReceived);
router
    .route("/send")
    .all(
        authMiddleware,
        checkSubscribe,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
    )
    .get(AuthuthrationRequest("request", "all"), getAllSend);
router
    .route("/:id")
    .all(
        authMiddleware,
        checkSubscribe,
        AuthuthrationRequest("request", "get"),
    )
    .get(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), getRequestById)
    .put(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), updateRequest)
    .delete(checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE), deleteRequest);

export default router;
