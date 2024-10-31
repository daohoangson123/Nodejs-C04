import { Router } from 'express';
import ProjectController from '../app/controllers/projectController.js';
const projectRoute = Router();

// Rest api

projectRoute.post('/projects/fetch', ProjectController.getProjects);

projectRoute.post('/projects', ProjectController.createProject);

projectRoute.put('/projects/:id', ProjectController.updateProject);

projectRoute.delete(
    '/projects/:id',
    // authenticated,
    // authorization('manager'),
    ProjectController.deleteProject,
);

export default projectRoute;
