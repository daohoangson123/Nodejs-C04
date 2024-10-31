import { Router } from 'express';
import SubscriberController from '../app/controllers/subscriberController.js';
const subscriberRoute = Router();

// Rest api

subscriberRoute.post('/subscribers/fetch', SubscriberController.getSubscribers);

subscriberRoute.post('/subscribers', SubscriberController.createSubscriber);

subscriberRoute.delete(
    '/subscribers/:id',
    // authenticated,
    // authorization('manager'),
    SubscriberController.deleteSubscriber,
);

export default subscriberRoute;
