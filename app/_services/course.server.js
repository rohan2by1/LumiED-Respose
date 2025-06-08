import { getUserID } from "../_lib/auth";
import dbConnect from "../_lib/dbConnect";
import DigitalCourse from "../_schemas/digitalCourse.schema";

export const getCourses = async (limit = null) => {
  await dbConnect();

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

  return courses;
};
