import { Router } from "express";
import {
    activateSubscription,
    buySubscription,
    createSubscription,
    deleteSubscription,
    getAllsubscriptions,
    getSubscriptionById,
    getUserSubscriptions,
    updateSubscription,
} from "../../controllers/subscriptions";
import { checkRole } from "../../middlewares/access";
import { authMiddleware } from "../../middlewares/auth";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import validatePackage from "../../validators/package.validator";


const subscriptionsRouter = Router();

subscriptionsRouter.route("/").all(
    authMiddleware,
    checkRole(Roles.SUPER_ADMIN))
    .get(getAllsubscriptions)
    .post(
        validator(validatePackage, "post"),
        createSubscription);

subscriptionsRouter.route("/updates/:id")
    .all(authMiddleware)
    .get(checkRole(Roles.SUPER_ADMIN, Roles.ROOT), getSubscriptionById)
    .put(checkRole(Roles.SUPER_ADMIN), validator(validatePackage, "put"), updateSubscription)
    .delete(checkRole(Roles.SUPER_ADMIN), deleteSubscription)
    .post(checkRole(Roles.SUPER_ADMIN, Roles.ROOT), activateSubscription);

subscriptionsRouter.route("/buy").post(
    authMiddleware,
    checkRole(Roles.USER),
    buySubscription,
);

subscriptionsRouter.route("/getSubscriptionByUser").get(authMiddleware, checkRole(Roles.ROOT), getUserSubscriptions);
export default subscriptionsRouter;

