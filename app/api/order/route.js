import { getUserID } from "@/app/_lib/auth";
import Cart from "@/app/_schemas/cart.schema";
import CourseProgress from "@/app/_schemas/courseProgress.schema";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import EnrolledCourse from "@/app/_schemas/enrolledCourse.schema";
import Payment from "@/app/_schemas/payment.schema";
import { convertToSec } from "@/app/_utils/common";
import { ReE, ReS } from "@/app/_utils/responseHandler.util";
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID)
  throw new Error("RAZORPAY_KEY_ID is not defined");

if (!process.env.RAZORPAY_KEY_SECRET)
  throw new Error("RAZORPAY_KEY_SECRET is not defined");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    const { cart_id, course_id } = await req.json();

    let amount = 0;
    let courseDetails = null;
    let cart = null

    if (cart_id) {
      cart = await Cart.findOne({ cart_id, status: "active" });

      if (!cart)
        return ReE("Something went wrong", "Cart not found", 404);

      courseDetails = await DigitalCourse.find({course_id: { $in: cart.course_ids }, status: "published"});
    }

    else if (course_id) {
      courseDetails = await DigitalCourse.find({ course_id, status: "published" }).limit(1);
    }

    else {
      return ReE("Missing data", "Either course_id or cart_id is required", 400);
    }

    if (!courseDetails?.length)
        return ReE("Something went wrong", "Courses not found", 404);

    courseDetails.forEach((course) => (amount += course.price));

    if(amount === 0){
        const enrolledCourses = [];
        const progressCourses = [];
        const enrolledCoursesData = {
            user_id: user_id,
            type: "free",
        };
        const progressCoursesData = {
          user_id,
          watched_seconds: 0         
        };
        courseDetails.forEach((course) => {
          enrolledCourses.push({ course_id: course.course_id, ...enrolledCoursesData });
          progressCourses.push({ course_id: course.course_id, total_duration: convertToSec(course.course_duration),  ...progressCoursesData })
        });
        
        const enrolledCourseData = await EnrolledCourse.insertMany(enrolledCourses);
        const progressCourseData = await CourseProgress.insertMany(progressCourses);
        
        if(cart){
          if (cart.status === "checkout") 
            return ReE("Something went wrong", "Cart already checked out", 401);
          
          cart.status = "checkout";
          await cart.save();
        }
        
        return ReS("Successfully enrolled!", {enrolledCourseData, progressCourseData}, 200);
    }

    // Razorpay order creation
    const options = {
      amount: parseFloat(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await new Promise((resolve, reject) => {
      razorpay.orders.create(options, (err, order) => {
        if (err) return reject(err);
        resolve(order);
      });
    });

    // Payment record creation
    await Payment.create({
      user_id,
      course_id: course_id || undefined,
      cart_id: cart_id || undefined,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      attempts: order.attempts,
    });

    return ReS("Ordered successfully", { order_id: order.id, amount: order.amount }, 200);
  } catch (err) {
    console.error("Create order error:", err);
    return ReE("Something went wrong", err, 500);
  }
}
