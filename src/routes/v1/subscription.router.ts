import { Router } from "express";
import { 
     activateSubscription,
     buySubscription,
     createSubscription,
     deleteSubscription,
     getAllsubscriptions, 
     getSubscriptionById, 
     getUserSubscriptions, 
     updateSubscription
    } from "../../controllers/subscriptions";
import { checkRole } from "../../middlewares/acsses";
import { AuthenticationMiddleware } from "../../middlewares/auth";
import { validator } from "../../middlewares/validate";
import { Roles } from "../../types/enums";
import validatePackage from "../../validators/packageValidator";

const subscriptionsRouter = Router();

subscriptionsRouter.route('/').all(
    AuthenticationMiddleware,
    checkRole(Roles.SUPER_ADMIN))
    .get(getAllsubscriptions)
    .post(
    validator(validatePackage,"post"),
    createSubscription);

subscriptionsRouter.route('/updates/:id')
    .all(AuthenticationMiddleware)
    .get(checkRole(Roles.SUPER_ADMIN, Roles.ROOT), getSubscriptionById)
    .put(checkRole(Roles.SUPER_ADMIN), validator(validatePackage,"put"), updateSubscription)
    .delete(checkRole(Roles.SUPER_ADMIN), deleteSubscription)
    .post(checkRole(Roles.SUPER_ADMIN, Roles.ROOT), activateSubscription)

subscriptionsRouter.route('/buy').post(
    AuthenticationMiddleware, 
    checkRole(Roles.USER),
    buySubscription
    )

subscriptionsRouter.route('/getSubscriptionByUser').get(AuthenticationMiddleware, checkRole(Roles.ROOT),getUserSubscriptions)
export default subscriptionsRouter;

