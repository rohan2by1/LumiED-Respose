import { model, models, Schema } from "mongoose";
import DigitalCourse from "./digitalCourse.schema";

const courseProgressSchema = new Schema({
  user_id: { type: String, required: true },
  course_id: { type: String, required: true },
  total_duration: { type: Number, required: true },
  watched_seconds: { type: Number, required: true, default: 0 },
  assignment_unlocked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  cert_id: { type: String, default: null },
}, { timestamps: true});

courseProgressSchema.pre("save", async function (next) {
  const ratio = this.watched_seconds / this.total_duration;
  this.assignment_unlocked = ratio >= 0.85;
  this.completed = ratio >= 1;
  if(!this.total_duration){
    const course = await DigitalCourse.findOne({course_id: this.course_id});
    this.total_duration = course.duration;
  }
  next();
});

const CourseProgress = models.courseProgress || model("courseProgress", courseProgressSchema);
export default CourseProgress;
