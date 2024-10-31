import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: { type: String, unique: true, required: true },
    content: { type: String },
    img: { type: String },
    categories: { type: String },
    isDelete: { type: Boolean, default: false },
    deletedDate: { type: Date, default: null },
});

const ProjectSchema = mongoose.model('projects', projectSchema);

export default ProjectSchema;
