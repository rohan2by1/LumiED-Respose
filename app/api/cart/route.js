import Cart from "@/app/_schemas/cart.schema"; // your Mongoose model
import dbConnect from "@/app/_lib/dbConnect"; // mongoose connection
import { ReE, ReS } from "@/app/_utils/responseHandler.util";
import DigitalCourse from "@/app/_schemas/digitalCourse.schema";
import { getUserID } from "@/app/_lib/auth";

export async function POST(request) {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    await dbConnect();

    const { course_id } = await request.json();
    if (!course_id)
      return ReE("Something went wrong!", "Course ID is required", 400);

    let cart = await Cart.findOne({ user_id, status: "active" });
    let course_ids = [];

    if (!cart) {
      cart = new Cart({
        user_id: user_id,
        course_ids: [course_id],
        status: "active",
      });
      course_ids = [course_id];
    } else if (cart.course_ids.includes(course_id)) {
      return ReE("Course already added", "Something went wrong", 401);
    } else {
      cart.course_ids.push(course_id);
      course_ids = [...cart.course_ids , course_id];
    }

    const courses_data = await DigitalCourse.find({ course_id: { $in: course_ids } },
        {
          _id: 0,
          price: 1,
          course_name: 1,
          course_thumbnail: 1,
          course_duration: 1,
          course_id: 1,
          unique_url: 1
        }
      );

    await cart.save();
    return ReS(
      "Course added successfully",
      { cart_id: cart.cart_id, courses_data },
      201
    );
  } catch (err) {
    console.error(err);
    return ReE("Something went wrong", err, 501);
  }
}

export async function GET() {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    await dbConnect();

    let cart = await Cart.findOne({ user_id, status: "active" });
    let courses_data = [];

    if (!cart) {
      cart = Cart.create({
        user_id: user_id,
        course_ids: [],
        status: "active",
      });
    } else {
      courses_data = await DigitalCourse.find(
        { course_id: { $in: cart.course_ids } },
        {
          _id: 0,
          price: 1,
          course_name: 1,
          course_thumbnail: 1,
          course_duration: 1,
          course_id: 1,
          unique_url: 1
        }
      );
    }

    return ReS(
      "Course added successfully",
      { cart_id: cart.cart_id, courses_data },
      200
    );
  } catch (err) {
    console.error(err);
    return ReE("Something went wrong", err, 501);
  }
}

export async function PUT(request) {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id;

    await dbConnect();

    const { course_id } = await request.json();

    let cart = await Cart.findOne({ user_id, status: "active" });

    if (!cart) {
      return ReE("Something went wrong", "Cart not found", 401);
    }

    if (!cart.course_ids.includes(course_id)) {
      return ReE("Something went wrong", "Course not exists on cart", 401);
    }
    cart.course_ids = cart.course_ids.filter((id) => id !== course_id);
    await cart.save();
    return ReS(
      "Course deleted successfully",
      { cart_id: cart.cart_id, course_ids: cart.course_ids },
      200
    );
  } catch (err) {
    console.error(err);
    return ReE("Something went wrong", err, 501);
  }
}
