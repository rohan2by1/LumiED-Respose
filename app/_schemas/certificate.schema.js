import { model, models, Schema } from "mongoose";

const certificateSchema = new Schema({
    cert_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    date_issued: {
        type: Date,
        required: true,
        default: Date.now()
    },
    percentage: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Certificate = models.certificates ||  model("certificates", certificateSchema);

export default Certificate;