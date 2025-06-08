import { model, models, Schema } from "mongoose";

// Lecture schema
const lectureSchema = new Schema({
  name: { type: String},
  preview: { type: Boolean, default: false },
  duration: { type: String }
}, { _id: false });

// Section content schema
const contentSchema = new Schema({
  title: { type: String},
  lectures: { type: [lectureSchema], default: [] }
}, { _id: false });

// Main digital course schema
const courseSchema = new Schema({
  course_id: { type: String, required: true, unique: true }, // Unique ID for the course
  unique_url: { type: String, required: true, unique: true }, // URL slug
  video_link: { type: String, required: true }, // YouTube embed link
  course_name: { type: String, required: true }, // Course name
  course_title: { type: String, required: true }, // Course info (short description)
  course_description: { type: String },
  course_thumbnail: { type: String, required: true },
  course_duration: { type: String, required: true },
  assignment_added: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published", "unpublished"], default: "draft" },
  // New fields
  price: { type: Number, required: true, default: 0 },
  instructor: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  language: { type: String, default: "English" },

  what_you_will_learn: [{ type: String }],
  includes: {
    video_hours: { type: String },
    articles: { type: String },
    downloads: { type: String },
    access: { type: String },
    certificate: { type: String }
  },
  content: { type: [contentSchema], default: [] },
}, { timestamps: true });

const DigitalCourse = models.digitalCourses || model("digitalCourses", courseSchema);

export default DigitalCourse;
