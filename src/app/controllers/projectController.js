import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    BadRequest,
    PaginationResponse,
    SuccessResponse,
} from '../apiResponses/apiResponse.js';
import ProjectSchema from '../models/projectSchema.js';

class ProjectController {
    async createProject(req, res, next) {
        try {
            const { title, content, img, categories } = req.body;
            // Create model to insert database
            const project = new ProjectSchema({
                title,
                content,
                img,
                categories,
            });

            // Save to database and return result
            await project.save();
            return res
                .status(HttpStatusCode.Ok)
                .send(new SuccessResponse(project));
        } catch (error) {
            next(error);
        }
    }

    async getProjects(req, res, next) {
        const { pageIndex, pageSize, sort } = req.body;

        const page = Number.parseInt(pageIndex || 1);
        const limit = Number.parseInt(pageSize || 8);

        const query = ProjectSchema.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (sort) {
            query.sort({
                [sort.field]: sort.value === 'asc' ? 1 : -1,
            });
        }

        const projects = await query;
        const total = await ProjectSchema.countDocuments();

        const convertData = projects.map((project) => ({
            id: project._id,
            title: project.title,
            content: project.content,
            img: blog.project,
            categories: project.categories,
            isDelete: project.isDelete,
            deletedDate: project.deletedDate,
        }));
        return res
            .status(HttpStatusCode.Ok)
            .send(new PaginationResponse(convertData, page, limit, total));
    }

    async updateProject(req, res, next) {
        try {
            const { id } = req.params;

            const { title, content, img, categories } = req.body;

            const project = await ProjectSchema.findOne({
                _id: id,
            });

            if (!project) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Project does not exist in Database'));
            }

            const updateResult = await ProjectSchema.updateOne(
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
                    .send(
                        new BadRequest('Can not update project with id: ' + id),
                    );
            }

            if (project.isDelete === true) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Project already deleted'));
            }

            return res
                .status(HttpStatusCode.Ok)
                .send(
                    new SuccessResponse(
                        'Project has been updated successfully',
                    ),
                );
        } catch (error) {
            next(error);
        }
    }

    async deleteProject(req, res, next) {
        const { id } = req.params;

        const project = await ProjectSchema.findOne({
            _id: id,
        });

        if (!project) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('Project does not exist in Database'));
        }

        const updateResult = await ProjectSchema.updateOne(
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
                .send(new BadRequest('Can not delete project with id: ' + id));
        }

        if (project.isDelete === true) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(
                    new BadRequest('Project already deleted, can not update'),
                );
        }

        return res
            .status(HttpStatusCode.Ok)
            .send(new SuccessResponse('Project has been deleted successfully'));
    }
}

export default new ProjectController();
