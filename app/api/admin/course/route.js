import { v4 as uuidv4 } from "uuid";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema"; // adjust your import if needed
import { ReS, ReE } from "@/app/_utils/responseHandler.util"; // your custom response helpers
import { digitalCoursePayloadSchema } from "@/app/_validation/digitalCourse.zod";
import dbConnect from "@/app/_lib/dbConnect";
import { adminAuth } from "@/app/_lib/auth";

export async function POST(request) {
  try {
    const authError = await adminAuth();
    if (authError) 
      return authError;

    await dbConnect();
    const formData = await request.formData();

    const course_id = `course-${uuidv4()}`;

    const unique_url = formData.get("unique_url");
    const video_link = formData.get("video_link");

    const course_name = formData.get("course_name");
    const course_title = formData.get("course_title");
    const course_description = formData.get("course_description");
    const course_thumbnail = formData.get("course_thumbnail"); // Uploaded to ImageKit -> returns URL
    const course_duration = formData.get("course_duration");
    const assignment_added = formData.get("assignment_added") === "on" ? true : false;

    const price = Number(formData.get("price"));
    const instructor = formData.get("instructor");
    const language = formData.get("language") || "English";

    // JSON fields
    const what_you_will_learn = JSON.parse(
      formData.get("what_you_will_learn") || "[]"
    );
    const includes = JSON.parse(formData.get("includes") || "{}");
    const content = JSON.parse(formData.get("content") || "[]");

    // Validate required
    if (!course_name) {
      return ReE("Validation Error", "Course name is required", 400);
    }
    if (!course_title) {
      return ReE("Validation Error", "Course info is required", 400);
    }
    if (!course_description) {
      return ReE("Validation Error", "Course description is required", 400);
    }
    if (!course_duration) {
      return ReE("Validation Error", "Course duration is required", 400);
    }
    if (!course_thumbnail) {
      return ReE("Validation Error", "Course thumbnail is required", 400);
    }
    if (!video_link) {
      return ReE("Validation Error", "YouTube embed link is required", 400);
    }
    if (!unique_url) {
      return ReE("Validation Error", "Course URL slug is required", 400);
    }

    // Create Course
    const courseData = {
      course_id,
      unique_url,
      video_link,
      course_name,
      course_title,
      course_description,
      course_thumbnail,
      course_duration,
      assignment_added,
      price,
      instructor,
      language,
      what_you_will_learn,
      includes,
      content
    }

    const zodValidation = digitalCoursePayloadSchema.safeParse(courseData);
    if (!zodValidation.success) {
      return ReE("Validation Error", zodValidation.error.errors, 400);
    }

    const course = new DigitalCourse(courseData);

    await course.save();

    return ReS("Course uploaded successfully!", course, 201);
  } catch (error) {
    console.error(error);
    return ReE(
      "An error occurred while uploading the course",
      error.message,
      500
    );
  }
}

// export async function PUT(request) {
//   try {
//     const authError = await adminAuth();
//     if (authError) 
//       return authError;

//     await dbConnect();
//     const formData = await request.formData();
//     const unique_url = formData.get("unique_url");

//     const course_id = formData.get("course_id");

//     const video_link = formData.get("video_link");

//     const course_name = formData.get("course_name");
//     const course_title = formData.get("course_title");
//     const course_description = formData.get("course_description");
//     const course_thumbnail = formData.get("course_thumbnail"); // Uploaded to ImageKit -> returns URL
//     const course_duration = formData.get("course_duration");
//     const assignment_added = formData.get("assignment_added") === "on" ? true : false;

//     const price = Number(formData.get("price"));
//     const instructor = formData.get("instructor");
//     const language = formData.get("language") || "English";

//     // JSON fields
//     const what_you_will_learn = JSON.parse(
//       formData.get("what_you_will_learn") || "[]"
//     );
//     const includes = JSON.parse(formData.get("includes") || "{}");
//     const content = JSON.parse(formData.get("content") || "[]");

//     // Validate required
//     if (!course_name) {
//       return ReE("Validation Error", "Course name is required", 400);
//     }
//     if (!course_title) {
//       return ReE("Validation Error", "Course info is required", 400);
//     }
//     if (!course_description) {
//       return ReE("Validation Error", "Course description is required", 400);
//     }
//     if (!course_duration) {
//       return ReE("Validation Error", "Course duration is required", 400);
//     }
//     if (!course_thumbnail) {
//       return ReE("Validation Error", "Course thumbnail is required", 400);
//     }
//     if (!video_link) {
//       return ReE("Validation Error", "YouTube embed link is required", 400);
//     }
//     if (!unique_url) {
//       return ReE("Validation Error", "Course URL slug is required", 400);
//     }

//     // Create Course
//     const courseData = {
//       course_id,
//       unique_url,
//       video_link,
//       course_name,
//       course_title,
//       course_description,
//       course_thumbnail,
//       course_duration,
//       assignment_added,
//       price,
//       instructor,
//       language,
//       what_you_will_learn,
//       includes,
//       content
//     }

//     const zodValidation = digitalCoursePayloadSchema.safeParse(courseData);
//     if (!zodValidation.success) {
//       return ReE("Validation Error", zodValidation.error.errors, 400);
//     }

//     const course = await DigitalCourse.updateOne(courseData);

//     return ReS("Course updated successfully!", course, 200);
//   } catch (error) {
//     console.error(error);
//     return ReE(
//       "An error occurred while uploading the course",
//       error.message,
//       500
//     );
//   }
// }

export async function DELETE(request) {
  try {
    const authError = await adminAuth();
    if (authError) 
      return authError;

    await dbConnect();
    const { course_id } = await request.json();

    if (!course_id) {
      return ReE("Validation Error", "Course ID is required", 400);
    }

    const course = await DigitalCourse.findOneAndDelete({ course_id });

    if (!course) {
      return ReE(
        "Course not found",
        "No course found with the provided ID",
        404
      );
    }

    return ReS("Course deleted successfully!", {}, 200);
  } catch (error) {
    console.error(error);
    return ReE(
      "An error occurred while deleting the course",
      error.message,
      500
    );
  }
}

export async function GET(request) {
  try {
    const authError = await adminAuth();
    if (authError) 
      return authError;

    await dbConnect();
    const { searchParams } = request.nextUrl;
    const sizeParam = searchParams.get("size");
    const limit = sizeParam ? parseInt(sizeParam) : null;

    // Build the base query
    let query = DigitalCourse.find({},
      {
        _id: 0,
        course_id: 1,
        unique_url: 1,
        course_name: 1,
        course_thumbnail: 1,
        course_title: 1,
        course_duration: 1,
        price: 1,
        status: 1
      }
    ).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const courses = await query.exec();

    return ReS("Courses fetched successfully", courses, 200);
  } catch (error) {
    console.error(error);
    return ReE("An error occurred while fetching the courses", error, 500);
  }
}

export async function PATCH(request) {
  try{
    // 1. Guard
  const authError = await adminAuth();
  if (authError) return authError;

  // 2. Connect
  await dbConnect();  

  // 3. Read payload
  const { courseIDs, action } = await request.json();


  // 4. Bulk update all at once
  const result = await DigitalCourse.updateMany({course_id: {$in: courseIDs}}, { status: action },  { runValidators: true });

  return ReS(`Updated ${result.modifiedCount} course(s) to "${action}"`, result, 200);
  }
  catch(error){
    console.error(error);
    return ReE("An error occurred while fetching the courses", error, 500);
  }
}