import { model, models, Schema } from "mongoose";

const noteSchema = new Schema({
    node_id: {
        type: String,
        required: true
    },
    note_name: {
        type: String,
        required: false
    },
    note_content: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Note = models.notes || model('notes', noteSchema);

export default Note;