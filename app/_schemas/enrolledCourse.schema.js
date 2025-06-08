// app/_schemas/enrolledCourse.schema.js

import { model, models, Schema } from "mongoose";

const enrolledCourseSchema = new Schema(
  {
    user_id: {
      type: String,
      ref: "users",
      required: true,
    },
    course_id: {
      type: String,
      ref: "digitalCourses",
      required: true,
    },
    
    order_id: { type: String },
    payment_id: { type: String },

    type: {
        type: String,
        enum: ["free", "paid"],
    }
  },
  { timestamps: true }
);

const EnrolledCourse = models.enrolledCourses || model("enrolledCourses", enrolledCourseSchema);

export default EnrolledCourse;
