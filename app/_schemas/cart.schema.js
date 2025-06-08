import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const cartSchema = new Schema(
  {
    cart_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `cart-${uuidv4()}`
    },
    user_id: {
      type: String,
      required: true,
    },
    course_ids: [
      {
        type: String,
        ref: "digitalCourses",
      },
    ],
    status: {
        type: String,
        required: true,
        default: "active",
        enum: ["checkout", "active", "cancelled"],
    }
  },
  { timestamps: true }
);

const Cart = models.carts || model("carts", cartSchema);

export default Cart;
