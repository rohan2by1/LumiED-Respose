// app/test/create-course-api
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import dbConnect from "@/app/_lib/dbConnect";
import digitalCourse_data from "../digitalCourse_data";

export async function GET() {
  try {
    await dbConnect();

    await DigitalCourse.syncIndexes();

    const digitalcourses = await DigitalCourse.find({ status: "published" });
    
    if (digitalcourses.length > 1)
      return Response.json(
        {
          success: true,
          message: `Courses already exists.`,
        },
        { status: 200 }
      );

    const courses = await DigitalCourse.create(digitalCourse_data);

    return Response.json(
      {
        success: true,
        courses_inserted: courses.length,
        message: `Courses created.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        success: false,
      },
      { status: 501 }
    );
  }
}
