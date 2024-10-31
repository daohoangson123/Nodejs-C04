import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
    email: { type: String, unique: true, required: true },
    subscribeDate: { type: Date, default: new Date() },
    isDelete: { type: Boolean, default: false },
    deletedDate: { type: Date, default: null },
});

const SubscriberSchema = mongoose.model('subscribers', subscriberSchema);

export default SubscriberSchema;
