import { Router } from 'express';
import AuthController from '../app/controllers/authController.js';
const userRoute = Router();

// Rest api

userRoute.post('/users/fetch', AuthController.getUsers);

userRoute.post('/users', AuthController.createUser);

userRoute.put('/users', AuthController.createUser);

userRoute.delete(
    '/users/:id',
    // authenticated,
    // authorization('manager'),
    AuthController.deleteUser,
);

export default userRoute;
