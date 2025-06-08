import { v4 as uuidv4 } from "uuid";
import { getUserID } from "@/app/_lib/auth";
import dbConnect from "@/app/_lib/dbConnect";
import Assignment from "@/app/_schemas/assignment.schema";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import EnrolledCourse from "@/app/_schemas/enrolledCourse.schema";
import { ReE, ReS } from "@/app/_utils/responseHandler.util";
import Certificate from "@/app/_schemas/certificate.schema";

export async function POST(request, { params }) {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    // TODO:
    // 1. user should enrolled the course
    // 2. user progress should be more than 75%

    await dbConnect();

    const { unique_url } = await params;
    const { answers } = await request.json();

    const course = await DigitalCourse.findOne(
      { unique_url },
      { course_id: 1 }
    );

    if (!course) return ReE("Course not found", "", 404);

    const course_enrolled = await EnrolledCourse.findOne({
      user_id,
      course_id: course.course_id,
    });

    if (!course_enrolled) return ReE("Course not enrolled", "", 403);

    const assignment = await Assignment.findOne({
      course_id: course.course_id,
    });
    if (!assignment || !assignment.questions)
      return ReE("Assignment not found", "", 404);

    // console.log(assignment)
    let correct = 0;
    assignment.questions.forEach((q, idx) => {
      // If there is an answer and it matches the correct one
      if (answers[idx] && q[answers[idx]] === q.ans) {
        correct++;
      }
    });

    const wrong = assignment.questions.length - correct;
    const percentage = (correct/(correct+wrong)) * 100;

    let cert_id = null;
    if(percentage >= 75){
      cert_id = `cert-${uuidv4()}`;
      await Certificate.create({cert_id, user_id, course_id:  course.course_id, percentage})
    }

    return ReS("Assignment fetched successfully!", { correct, wrong, percentage, cert_id }, 200);
  } catch (error) {
    console.error(error);
    return ReE(
      "An error occurred while uploading the course",
      error.message,
      500
    );
  }
}

export async function GET(request, { params }) {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    // TODO:
    // 1. user should enrolled the course
    // 2. user progress should be more than 75%

    await dbConnect();

    const { unique_url } = await params;

    const course = await DigitalCourse.findOne(
      { unique_url },
      { course_id: 1 }
    );

    if (!course) return ReE("Course not found", "", 404);

    const examAttempted = await Certificate.findOne({course_id: course.course_id, user_id});
    if(examAttempted) 
      return ReE("Exam already attempted", "", 203);

    const course_enrolled = await EnrolledCourse.findOne({
      user_id,
      course_id: course.course_id,
    });

    if (!course_enrolled) return ReE("Course not enrolled", "", 403);

    const assignment = await Assignment.findOne(
      {
        course_id: course.course_id,
      },
      { _id: 0, "questions.ans": 0, course_id: 0, assignment_id: 0 }
    );
    if (!assignment || !assignment.questions)
      return ReE("Assignment not found", "", 404);

    return ReS("Assignment fetched successfully!", assignment.questions, 200);
  } catch (error) {
    console.error(error);
    return ReE(
      "An error occurred while uploading the course",
      error.message,
      500
    );
  }
}
