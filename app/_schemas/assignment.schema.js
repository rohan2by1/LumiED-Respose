import { model, models, Schema } from "mongoose";

const questionSchema = new Schema({
  qs: String,
  a: String,
  b: String,
  c: String,
  d: String,
  ans: String,
});

const assignmentSchema = new Schema({
  assignment_id: { type: String, required: true },
  course_id: { type: String, required: true },
  questions: [questionSchema],
});

const Assignment = models.assignment || model('assignment', assignmentSchema);

export default Assignment;
