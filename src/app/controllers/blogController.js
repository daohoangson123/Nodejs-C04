import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    BadRequest,
    PaginationResponse,
    SuccessResponse,
} from '../apiResponses/apiResponse.js';
import BlogSchema from '../models/blogSchema.js';

class BlogController {
    async createBlog(req, res, next) {
        try {
            const { title, content, img, categories } = req.body;
            // Create model to insert database
            const blog = new BlogSchema({
                title,
                content,
                img,
                categories,
            });

            // Save to database and return result
            await blog.save();
            return res
                .status(HttpStatusCode.Ok)
                .send(new SuccessResponse(blog));
        } catch (error) {
            next(error);
        }
    }

    async getBlogs(req, res, next) {
        const { pageIndex, pageSize, sort } = req.body;

        const page = Number.parseInt(pageIndex || 1);
        const limit = Number.parseInt(pageSize || 8);

        const query = BlogSchema.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (sort) {
            query.sort({
                [sort.field]: sort.value === 'asc' ? 1 : -1,
            });
        }

        const blogs = await query; // at this time it will call to db and get data to client
        const total = await BlogSchema.countDocuments();

        const convertData = blogs.map((blog) => ({
            id: blog._id,
            title: blog.title,
            content: blog.content,
            img: blog.img,
            categories: blog.categories,
            postDate: blog.postDate,
            isDelete: blog.isDelete,
            deletedDate: blog.deletedDate,
        }));
        return res
            .status(HttpStatusCode.Ok)
            .send(new PaginationResponse(convertData, page, limit, total));
    }

    async updateBlog(req, res, next) {
        try {
            const { id } = req.params;

            const { title, content, img, categories } = req.body;

            const blog = await BlogSchema.findOne({
                _id: id,
            });

            if (!blog) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Blog does not exist in Database'));
            }

            const updateResult = await BlogSchema.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        title: title,
                        content: content,
                        img: img,
                        categories: categories,
                    },
                },
            );

            if (updateResult.modifiedCount === 0) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Can not update blog with id: ' + id));
            }

            if (blog.isDelete === true) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Blog already deleted'));
            }

            return res
                .status(HttpStatusCode.Ok)
                .send(
                    new SuccessResponse('Blog has been updated successfully'),
                );
        } catch (error) {
            next(error);
        }
    }

    async deleteBlog(req, res, next) {
        const { id } = req.params;

        const blog = await BlogSchema.findOne({
            _id: id,
        });

        if (!blog) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('Blog does not exist in Database'));
        }

        const updateResult = await BlogSchema.updateOne(
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
                .send(new BadRequest('Can not delete blog with id: ' + id));
        }

        if (blog.isDelete === true) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('Blog already deleted, can not update'));
        }

        return res
            .status(HttpStatusCode.Ok)
            .send(new SuccessResponse('Blog has been deleted successfully'));
    }
}

export default new BlogController();
