import crypto from "crypto";
import Razorpay from "razorpay";
import dbConnect from "@/app/_lib/dbConnect";
import Payment from "@/app/_schemas/payment.schema";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import { userAuth } from "@/app/_lib/auth";
import EnrolledCourse from "@/app/_schemas/enrolledCourse.schema";
import Cart from "@/app/_schemas/cart.schema";
import CourseProgress from "@/app/_schemas/courseProgress.schema";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import { convertToSec } from "@/app/_utils/common";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  let orderCreationId = null;
  let razorpayPaymentId = null;

  try {
    // ✅ Auth check
    const authError = await userAuth();
    if (authError) return authError;

    await dbConnect();

    const body = await req.json();
    const { razorpaySignature, orderCreationId: orderId, razorpayPaymentId: paymentId } = body;

    orderCreationId = orderId;
    razorpayPaymentId = paymentId;

    // ✅ Step 1: Signature verification
    const signaturePayload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await Payment.findOneAndUpdate(
        { order_id: orderId },
        {
          payment_id: paymentId,
          verified: false,
          status: "failed",
        }
      );
      return ReE("Payment signature verification failed", {}, 400);
    }

    // ✅ Step 2: Fetch payment from Razorpay
    const { items } = await razorpay.orders.fetchPayments(orderId);
    if (!items?.length) {
      return ReE("No payment found for this order", {}, 404);
    }

    const payment = items[0];

    // ✅ Step 3: Update local DB
    const updatedPayment = await Payment.findOneAndUpdate(
      { order_id: orderId },
      {
        payment_id: payment.id,
        status: payment.status === "captured" ? "paid" : payment.status,
        verified: true,
        currency: payment.currency,
        email: payment.email,
        phone: payment.contact,
        method: payment.method,
        fee: payment.fee,
        tax: payment.tax,
        vpa: payment?.upi?.vpa || null,
      },
      { new: true }
    );

    if (!updatedPayment) {
      return ReE("Payment record not found", {}, 404);
    }

    const { cart_id, course_id, user_id } = updatedPayment;

    const enrolledCourses = [];
    const progressCourses = [];

    const commonData = {
      user_id,
      order_id: orderCreationId,
      payment_id: payment.id,
      type: "paid",
    };

    if (course_id) {
      // Single course
      enrolledCourses.push({ course_id, ...commonData });
      const progressData = await DigitalCourse.findOne({ course_id });
      progressCourses.push({ course_id, user_id, total_duration: convertToSec(progressData.course_duration), watched_seconds: 0 });
    } else {
      // Cart flow
      const cart = await Cart.findOne({ cart_id });
      if (!cart) return ReE("Cart not found", {}, 401);
      if (cart.status === "checkout") return ReE("Cart already checked out", {}, 401);

      const progData = await DigitalCourse.find({course_id: {$in: cart.course_ids}},{course_id: 1, course_duration: 1});
      for (const cid of cart.course_ids) {
        const courseData = progData.find(course => course.course_id === cid);
        const total_duration = convertToSec(courseData.course_duration)
        enrolledCourses.push({ course_id: cid, ...commonData });
        progressCourses.push({ course_id: cid, user_id, total_duration, watched_seconds: 0 });
      }

      cart.status = "checkout";
      await cart.save();
    }

    const enrolledCourseData = await EnrolledCourse.insertMany(enrolledCourses);
    const progressCourseData = await CourseProgress.insertMany(progressCourses);

    return ReS("Successfully enrolled!", {
      enrolledCourseData,
      progressCourseData,
    });
  } catch (err) {
    console.error("Payment verification error:", err);

    if (orderCreationId && razorpayPaymentId) {
      await Payment.findOneAndUpdate(
        { order_id: orderCreationId },
        {
          payment_id: razorpayPaymentId,
          verified: false,
          status: "failed",
        }
      );
    }

    return ReE("Something went wrong during verification", err, 500);
  }
}
