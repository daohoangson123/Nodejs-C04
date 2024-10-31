import UserSchema from '../models/userSchema.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import config from '../../config.js';
import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    BadRequest,
    PaginationResponse,
    SuccessResponse,
} from '../apiResponses/apiResponse.js';

class AuthController {
    signUp(req, res, next) {
        // Get data from model
        res.render('signup');
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        // 1. Find User by email has existed in database or not
        const getUser = await UserSchema.login(email, password);

        if (!getUser) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(
                    new BadRequest('Email is not existed, please try again!'),
                );
        }

        const payload = { email: getUser.email, roles: ['user'] };
        const token = jwt.sign(payload, config.jwt.secretKey, {
            expiresIn: Number.parseInt(config.jwt.expiresIn),
        });

        res.send(
            new SuccessResponse({
                access_token: token,
            }),
        );
    }

    async getUsers(req, res, next) {
        const { pageIndex, pageSize, sort } = req.body;

        const page = Number.parseInt(pageIndex || 1);
        const limit = Number.parseInt(pageSize || 10);

        const query = UserSchema.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (sort) {
            query.sort({
                [sort.field]: sort.value === 'asc' ? 1 : -1,
            });
        }

        const users = await query; // at this time it will call to db and get data to client
        const total = await UserSchema.countDocuments();

        const convertData = users.map((user) => ({
            id: user._id,
            email: user.email,
            isDelete: user.isDelete,
            deletedDate: user.deletedDate,
        }));
        return res
            .status(HttpStatusCode.Ok)
            .send(new PaginationResponse(convertData, page, limit, total));
    }

    async deleteUser(req, res, next) {
        const { id } = req.params;

        const user = await UserSchema.findOne({
            _id: id,
        });

        if (!user) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('User does not exist in Database'));
        }

        const updateResult = await UserSchema.updateOne(
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
                .send(new BadRequest('Can not delete user with id: ' + id));
        }

        return res.status(HttpStatusCode.Ok).send(new SuccessResponse());
    }

    async createUser(req, res, next) {
        try {
            const { email, password } = req.body;
            // 1. Validate email
            if (!validator.isEmail(email)) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Email format is invalid!'));
            }

            // 2. Find User by email has existed in database or not
            const getUser = await UserSchema.findOne({
                email,
            });

            if (getUser) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest('Email is existing, please try again!'),
                    );
            }

            // 3. Create model to insert database
            const user = new UserSchema({
                email,
                password,
            });

            // 4. Save to database and return result
            await user.save();
            return res
                .status(HttpStatusCode.Ok)
                .send(new SuccessResponse(user));
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
