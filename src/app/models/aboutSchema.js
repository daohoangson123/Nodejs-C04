import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const aboutSchema = new Schema({
    author: { type: String, required: true },
    content: { type: String },
    img: { type: String },
});

const AboutSchema = mongoose.model('about', aboutSchema);

export default AboutSchema;
