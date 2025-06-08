import dbConnect from "@/app/_lib/dbConnect";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import CourseProgress from "@/app/_schemas/courseProgress.schema";
import { getUserID } from "@/app/_lib/auth";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import EnrolledCourse from "@/app/_schemas/enrolledCourse.schema";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { unique_url } = await params;
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    const course = await DigitalCourse.findOne({ unique_url, status: "published" }).lean();
    if (!course) return ReE("Course not found", null, 404);

    const is_enrolled = await EnrolledCourse.exists({ user_id, course_id: course.course_id });

    if(!is_enrolled){
      return ReE("You are not enrolled in this course", null, 403);
    }

    const progress = await CourseProgress.findOne({ user_id, course_id: course.course_id }).lean();
    if (progress) {
      progress.percentage = Math.min(
        (progress.watched_seconds / progress.total_duration) * 100,
        100
      );
    }
    

    return ReS("Course fetched successfully", {
      course,
      is_enrolled: !!is_enrolled,
      progress: progress || null
    }, 200);
  } catch (error) {
    console.error("Error fetching course:", error.message || error);
    return ReE("An error occurred while fetching the course", error, 500);
  }
}
