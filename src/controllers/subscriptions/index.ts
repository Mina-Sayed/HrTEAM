import {Request, Response, NextFunction} from "express";
import {AuthenticatedReq} from "../../middlewares/auth";
import Subscription from "../../models/subscription";
import User from "../../models/user";
import {Roles} from "../../types/enums";

//@desc         get all subscription
//@route        GET /api/v1/subscriptions
//@access       private(super admin)
export const getAllsubscriptions = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    const allsubscriptions = await Subscription.find({});
    res.send({
        success: true,
        data: allsubscriptions,
        message: 'subscription are fetched successfully'
    });
};

//@desc         get Subscription by id
//@route        GET /api/v1/subscriptions/:id
//@access       private(super admin, Root)
export const getSubscriptionById = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{

    // if (req.user!.role === Roles.ROOT && req.user!._id === req.params.id) return res.status(401).send({
    //     success: false,
    //     message: 'user not allowed',
    // });
    const SubscriptionFetched = await Subscription.findOne({subscriber: req.params.id});
    res.send({
        success: true,
        data: SubscriptionFetched,
        message: 'Subscription is fetched successfully'
    });
};

//@desc         create a subscription
//@route        POST /api/v1/subscriptions
//@access       private(super admin)
export const createSubscription = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    const subscriptionCreated = await Subscription.create(req.body);
    res.status(201).send({
        success: true,
        data: subscriptionCreated,
        message: 'Subscription is created successfully'
    });
};

//@desc         update a subscription
//@route        PATCH /api/v1/subscriptions/:id
//@access       private(super admin)
export const updateSubscription = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    const subscriptionUpdated = await Subscription.findByIdAndUpdate(req.params.id);
    res.send({
        success: true,
        data: subscriptionUpdated,
        message: 'subscription is updated successfully'
    });
};

//@desc         delete a Subscription
//@route        DELETE /api/v1/subscriptions/:id
//@access       private(super admin)
export const deleteSubscription = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    await Subscription.findByIdAndRemove(req.params.id);
    res.status(204).send({
        success: true,
        message: 'subscription is deleted successfully'
    });
};

//@desc         get subscribtion of a user
//@route        get /api/v1/subscriptions/user/:id
//@access       private(super admin, Root)
export const getUserSubscriptions = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{

    const userSubscriptions = await Subscription.findOne({subscriber: req.user?._id}).populate([
        {path: 'package', model: "Package"}
    ]);
    if (!userSubscriptions) {
        return res.status(400).send({error_en: 'subscriptions Are Not Found ', error_ar: 'الاشتراكات غير موجودة'});
    }
    res.send({
        success: true,
        message: 'user subscriptions are fetched successfully',
        subscription: userSubscriptions
    });

};

//@desc         root subscribes to a package
//@route        POST /api/v1/subscriptions/user/:id
//@access       private(Root)
export const buySubscription = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    //EXTRA VALIDATE
    const subscripe = await Subscription.findOne({subscriber: req.user?._id, isExpired: false});
    if (subscripe) return res.status(400).send({error_en: "You already took a bouquet"});
    const userSubscriptions = new Subscription({
        subscriber: req.user?._id,
        package: req.body.package
    });
    await User.updateOne({_id: req.user?._id}, {
        $set: {
            role: "root"
        }
    });
    userSubscriptions.save();
    // Payment logic will be implemented here
    res.status(201).send({
        success: true,
        message: 'user subscribed to package',
        data: userSubscriptions
    });
};

//@desc         activate subscription
//@route        POST /api/v1/subscriptions/:id
//@access       private(super admin, Root)
export const activateSubscription = async (req: AuthenticatedReq, res: Response, next: NextFunction) =>
{
    const subscription = await Subscription.findById(req.params.id);
    // Not found subscription
    if (subscription === null) return res.status(404).send({
        success: false, message: 'subscription not found'
    });
    // not user's subscription
    if (req.user!.role === Roles.ROOT && req.user!._id !== subscription.subscriber) return res.status(401).send({
        success: false,
        message: 'user not allowed',
    });
    // activate subscription
    subscription.isActive = true;
    await subscription.save();
    // make the rest of user's subscriptions inactive
    await Subscription.updateMany({subscriber: req.user!._id}, {$set: {isActive: false}});

    res.send({
        success: true,
        message: 'package is activated successfully',
        data: subscription
    });
};