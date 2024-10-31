import { Router } from 'express';
import AuthController from '../app/controllers/authController.js';

const authRoute = Router();

authRoute.get('/signup', AuthController.signUp);
authRoute.post('/login', AuthController.login);

export default authRoute;
