import { getUserID } from "@/app/_lib/auth";
import dbConnect from "@/app/_lib/dbConnect";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema"; // adjust your import if needed
import { ReS, ReE } from "@/app/_utils/responseHandler.util"; // your custom response helpers

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const sizeParam = searchParams.get("size");
    const limit = sizeParam ? parseInt(sizeParam) : null;

    const user_id = await getUserID();

    const coursePipeline = [
      {
        $match: {
          status: "published",
        },
      },
    ];

    if (user_id) {
      coursePipeline.push(
        {
          $lookup: {
            from: "enrolledcourses",
            let: { cid: "$course_id" },
            as: "enrollment",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$course_id", "$$cid"] },
                      { $eq: ["$user_id", user_id] },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            is_enrolled: {
              $cond: {
                if: { $gt: [{ $size: "$enrollment" }, 0] },
                then: true,
                else: false,
              },
            },
          },
        }
      );
    }

    coursePipeline.push({
      $project: {
        _id: 0,
        course_id: 1,
        unique_url: 1,
        course_name: 1,
        course_thumbnail: 1,
        course_title: 1,
        price: 1,
        is_enrolled: 1,
      },
    });

    if (limit) coursePipeline.push({ $limit: limit });

    const courses = await DigitalCourse.aggregate(coursePipeline);

    if (!courses || courses?.length == 0) {
      return ReE("Courses not found", null, 404);
    }

    return ReS("Courses fetched successfully", courses, 200);
  } catch (error) {
    console.error(error);
    return ReE("An error occurred while fetching the courses", error, 500);
  }
}
