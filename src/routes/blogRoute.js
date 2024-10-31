import { Router } from 'express';
import BlogController from '../app/controllers/blogController.js';
const blogRoute = Router();

// Rest api

blogRoute.post('/blogs/fetch', BlogController.getBlogs);

blogRoute.post('/blogs', BlogController.createBlog);

blogRoute.put('/blogs/:id', BlogController.updateBlog);

blogRoute.delete(
    '/blogs/:id',
    // authenticated,
    // authorization('manager'),
    BlogController.deleteBlog,
);

export default blogRoute;
