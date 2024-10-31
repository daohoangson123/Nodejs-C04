import { Forbiden } from '../apiResponses/apiResponse.js';
import HttpStatusCode from '../constants/httpStatusCode.js';

const authorization = (role) => {
    return (req, res, next) => {
        const getRoles = res.locals.roles;
        if (Array.isArray(getRoles) && getRoles.includes(role)) {
            return next();
        }
        return res.status(HttpStatusCode.Forbiden).send(new Forbiden());
    };
};

export default authorization;
