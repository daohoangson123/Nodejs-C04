import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, unique: true, required: true },
    content: { type: String },
    img: { type: String },
    categories: { type: String },
    postDate: { type: Date, default: new Date() },
    isDelete: { type: Boolean, default: false },
    deletedDate: { type: Date, default: null },
});

const BlogSchema = mongoose.model('blogs', blogSchema);

export default BlogSchema;
