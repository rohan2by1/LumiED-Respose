import { compareSync, hashSync } from "bcrypt";

import User from "@/app/_schemas/user.schema";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import OTP from "@/app/_schemas/otp.schema";
import dbConnect from "@/app/_lib/dbConnect";

export async function POST(request) {
    try {
        dbConnect();
        const { email, otp, password } = await request.json();

        if ( !email || !password || !otp) {
            return ReE("Missing required fields", "email, password and otp all are required", 400);
        }

        const user = await User.findOne({email})
        if (!user) 
            return ReE("user not exists!", "user not exists.", 401);
        
        const records = await OTP.find({ target: email, type: "resetPassword" }).sort({ createdAt: -1 }).limit(1);
        const record = records?.[0];

        if (!record || Date.now() > new Date(record.expiresAt))
            return ReE("OTP expired or not found", "", 400);

        if (record.verified) 
            return ReE("OTP already verified", "", 400);

        if (!compareSync(otp, record.otpHash))
            return ReE("Invalid OTP", "", 400);

        const curr_password = hashSync(password, parseInt(process.env.SALT_ROUND));
        user.password = curr_password;
        record.verified = true;
        await Promise.all([user.save(), record.save()]);
        return ReS("Password reset successfully", "", 200);
    } catch (error) {
        console.error(error);
        return ReE("An error occurred while reseting password", error, 500);
    }
}