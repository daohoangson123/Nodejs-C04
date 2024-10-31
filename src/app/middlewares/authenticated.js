import jwt from 'jsonwebtoken';
import config from '../../config.js';
import HttpStatusCode from '../constants/httpStatusCode.js';
import { Unauthorize } from '../apiResponses/apiResponse.js';
const { TokenExpiredError } = jwt;

const authenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decode = jwt.verify(token, config.jwt.secretKey);
            res.locals.roles = decode.roles;
            next();
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send(new Unauthorize());
        }
    }
};

export default authenticated;

// authorization => định danh người dùng
// Authorization => dùng để check xem người dùng có quyền access hay k
