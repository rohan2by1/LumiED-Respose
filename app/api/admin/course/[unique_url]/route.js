import { adminAuth } from "@/app/_lib/auth";
import dbConnect from "@/app/_lib/dbConnect";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema"; // adjust your import if needed
import { ReS, ReE } from "@/app/_utils/responseHandler.util"; // your custom response helpers

export async function GET(request, {params}) {
  try {
    const authError = await adminAuth();
    if (authError) 
      return authError;
    
    await dbConnect();
    // Fetch one courses from the database
    const { unique_url } = await params;
    const courses = await DigitalCourse.findOne(
      {unique_url},
      {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        status: 0,
        video_link: 0,
      }
    );

    return ReS("Courses fetched successfully", courses, 200);
  } catch (error) {
    console.error(error);
    return ReE("An error occurred while fetching the courses", error, 500);
  }
}
