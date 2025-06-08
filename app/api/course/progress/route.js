import dbConnect from "@/app/_lib/dbConnect";
import CourseProgress from "@/app/_schemas/courseProgress.schema";
import { getUserID } from "@/app/_lib/auth";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";

export async function POST(req) {
  try {
    await dbConnect();

    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    const { course_id, watched_seconds } = await req.json();

    if (!course_id || typeof watched_seconds !== "number") {
      return ReE("Invalid input", null, 400);
    }

    const progress = await CourseProgress.findOne({ user_id, course_id });
    if (!progress) {
      return ReE("Progress record not found", null, 404);
    }

    progress.watched_seconds = Math.max(progress.watched_seconds, watched_seconds);
    await progress.save(); // Pre-save hook handles assignment unlock and complete

    return ReS("Progress updated successfully", null, 200);
  } catch (error) {
    console.error("Error updating progress:", error.message || error);
    return ReE("An error occurred while updating progress", error, 500);
  }
}
