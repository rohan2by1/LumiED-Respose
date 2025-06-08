// models/otp.js

import { model, models, Schema } from "mongoose";


const otpSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
      ref: 'User',
    },
    target: {
      type: String, // email or phone
      required: true,
    },
    type: {
      type: String,
      enum: ['other', 'email', 'phone', 'signup', 'resetPassword'],
      default: 'other',
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to auto-remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = models.otps || model('otps', otpSchema);

export default OTP;