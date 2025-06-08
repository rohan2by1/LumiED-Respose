import { z } from "zod";

const includesSchema = z.object({
  video_hours: z.string().optional(),
  articles: z.string().optional(),
  downloads: z.string().optional(),
  access: z.string().optional(),
  certificate: z.string().optional()
});

const lectureSchema = z.object({
  name: z.string().min(1),
  preview: z.boolean(),
  duration: z.string().min(1)
});

const sectionSchema = z.object({
  title: z.string().min(1),
  lectures: z.array(lectureSchema)
});

export const digitalCoursePayloadSchema = z.object({
  course_id: z.string().min(1), // added to match schema
  unique_url: z.string().regex(/^[a-z0-9-]+$/),
  video_link: z.string(),
  course_name: z.string().min(1),
  course_title: z.string().max(100),
  course_description: z.string().min(1000),
  course_thumbnail: z.string().url(),
  course_duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  assignment_added: z.boolean(),

  price: z.coerce.number().min(0),
  instructor: z.string().min(1),
  rating: z.coerce.number().optional(),
  reviews: z.coerce.number().optional(),
  students: z.coerce.number().optional(),
  language: z.string().min(1),

  what_you_will_learn: z.array(z.string().min(1)),
  includes: includesSchema,
  content: z.array(sectionSchema)
});
