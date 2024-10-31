import HttpStatusCode from '../constants/httpStatusCode.js';
import { BadRequest, SuccessResponse } from '../apiResponses/apiResponse.js';
import AboutSchema from '../models/aboutSchema.js';

class AboutController {
    async createAbout(req, res, next) {
        try {
            const { author, content, img } = req.body;
            // Create model to insert database
            const about = new AboutSchema({
                author,
                content,
                img,
            });

            // Save to database and return result
            await about.save();
            return res
                .status(HttpStatusCode.Ok)
                .send(new SuccessResponse(about));
        } catch (error) {
            next(error);
        }
    }

    async getAbout(req, res, next) {
        const about = await AboutSchema.find();

        return res.status(HttpStatusCode.Ok).send(new SuccessResponse(about));
    }

    async updateAbout(req, res, next) {
        try {
            const { id } = req.params;

            const { author, content, img } = req.body;

            const about = await AboutSchema.findOne({
                _id: id,
            });

            if (!about) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest('About data does not exist in Database'),
                    );
            }

            const updateResult = await AboutSchema.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        author: author,
                        content: content,
                        img: img,
                    },
                },
            );

            if (updateResult.modifiedCount === 0) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Can not update About data'));
            }

            return res
                .status(HttpStatusCode.Ok)
                .send(
                    new SuccessResponse(
                        'About data has been updated successfully',
                    ),
                );
        } catch (error) {
            next(error);
        }
    }
}

export default new AboutController();
