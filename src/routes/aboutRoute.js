import { Router } from 'express';
import AboutController from '../app/controllers/aboutController.js';
const aboutRoute = Router();

// Rest api

aboutRoute.post('/about', AboutController.createAbout);

aboutRoute.post('/about/fetch', AboutController.getAbout);

aboutRoute.put('/about/:id', AboutController.updateAbout);

export default aboutRoute;
