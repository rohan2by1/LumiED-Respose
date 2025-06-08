// app/_schemas/payment.schema.js

import { model, models, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user_id: { 
      type: String, 
      ref: "users", 
      required: true 
    },
    course_id: {
      type: String,
      ref: "digitalCourses",
    },
    cart_id: {
      type: String,
    },

    order_id: { type: String, required: true },
    payment_id: { type: String }, // filled after capture

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    verified: { type: Boolean, default: false },

    amount: { type: Number, required: true }, // in paise
    currency: { type: String, default: "INR" },
    
    email: String,
    phone: String,
    method: String, // upi, card, etc.
    fee: Number,
    tax: Number,
    receipt: String,
    attempts: Number,
    vpa: String,
  },
  { timestamps: true }
);

const Payment =  models.payments || model("payments", paymentSchema);

export default Payment;
