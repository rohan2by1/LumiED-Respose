import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import OTP from "@/app/_schemas/otp.schema";
import { hashSync } from "bcrypt";
import { sendMail } from "@/app/_lib/mail/sendMail";
import getOTP from "@/app/_utils/getOTP";
import getTemplateData from "@/app/_lib/mail/templates/getTemplateData";
import dbConnect from "@/app/_lib/dbConnect";

export async function POST(request) {
  try {
    return ReE("Something went wrong",{message: "This api is under maintenance"}, 503);

    dbConnect();
    const { email, type } = await request.json();

    if (!email) {
      return ReE("Missing required fields", "email is required", 400);
    }

    const otp = getOTP(); // 6-digit OTP
    const otpHash = hashSync(otp, parseInt(process.env.SALT_ROUND));

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await OTP.create({
      target: email,
      type: type,
      otpHash,
      expiresAt,
    });


    const mail = await sendMail({
      to: email,
      data: getTemplateData("signup", otp),
    });

    if(!mail.success) {
      return ReE("Failed to send OTP", mail.error, 500);
    }

    return ReS("OTP sent successfully", [], 200);
  } catch (error) {
    console.error("Error sending OTP:", error);
    return ReE("Failed to send OTP", error, 500);
  }
}
