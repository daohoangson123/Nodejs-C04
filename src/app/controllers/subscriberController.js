import SubscriberSchema from '../models/subscriberShema.js';
import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    BadRequest,
    PaginationResponse,
    SuccessResponse,
} from '../apiResponses/apiResponse.js';

class SubscriberController {
    async getSubscribers(req, res, next) {
        const { pageIndex, pageSize, sort } = req.body;

        const page = Number.parseInt(pageIndex || 1);
        const limit = Number.parseInt(pageSize || 10);

        const query = SubscriberSchema.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (sort) {
            query.sort({
                [sort.field]: sort.value === 'asc' ? 1 : -1,
            });
        }

        const subscribers = await query; // at this time it will call to db and get data to client
        const total = await SubscriberSchema.countDocuments();

        const convertData = subscribers.map((subscriber) => ({
            id: subscriber._id,
            email: subscriber.email,
            subcribeDate: subscriber.subcribeDate,
            isDelete: subscriber.isDelete,
            deletedDate: subscriber.deletedDate,
        }));
        return res
            .status(HttpStatusCode.Ok)
            .send(new PaginationResponse(convertData, page, limit, total));
    }

    async deleteSubscriber(req, res, next) {
        const { id } = req.params;

        const subscriber = await SubscriberSchema.findOne({
            _id: id,
        });

        if (!subscriber) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('Subscriber does not exist in Database'));
        }

        const updateResult = await SubscriberSchema.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    isDelete: true,
                    deletedDate: new Date(),
                },
            },
        );

        if (updateResult.modifiedCount === 0) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(
                    new BadRequest('Can not delete subscriber with id: ' + id),
                );
        }

        return res.status(HttpStatusCode.Ok).send(new SuccessResponse());
    }

    async createSubscriber(req, res, next) {
        try {
            const { email } = req.body;
            // 1. Validate email
            if (!validator.isEmail(email)) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Email format is invalid!'));
            }

            // 2. Find User by email has existed in database or not
            const getSubscriber = await SubscriberSchema.findOne({
                email,
            });

            if (getSubscriber) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest(
                            'Email is already subcribed, please use other email!',
                        ),
                    );
            }

            // 3. Create model to insert database
            const subscriber = new SubscriberSchema({
                email,
            });

            // 4. Save to database and return result
            await subscriber.save();
            return res
                .status(HttpStatusCode.Ok)
                .send(new SuccessResponse(subscriber));
        } catch (error) {
            next(error);
        }
    }
}

export default new SubscriberController();
