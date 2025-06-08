import dbConnect from "@/app/_lib/dbConnect";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import { getUserID } from "@/app/_lib/auth";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { unique_url } = await params;
    const user_id = await getUserID();

    const coursePipeline = [
      { 
        $match: { 
          status: "published", 
          unique_url 
        } 
      }
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
                      { $eq: ["$user_id", user_id] }
                    ]
                  }
                }
              }
            ]
          }
        },
        {
          $addFields: {
            is_enrolled: {
              $cond: {
                if: { $gt: [{ $size: "$enrollment" }, 0] },
                then: true,
                else: false
              }
            }
          }
        }
      );
    }

    coursePipeline.push({
      $project: {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        status: 0,
        video_link: 0,
        enrollment: 0
      }
    });

    const courses = await DigitalCourse.aggregate(coursePipeline);

    if(!courses || courses?.length !== 1){
      return ReE("Something went wrong", null, 404)
    }

    return ReS("Courses fetched successfully", courses[0], 200);
  } catch (error) {
    console.error("Error fetching courses:", error.message || error);
    return ReE("An error occurred while fetching the courses", error, 500); 
  }
}
