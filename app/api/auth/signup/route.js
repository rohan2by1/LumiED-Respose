import { compareSync, hashSync } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import User from "@/app/_schemas/user.schema";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import { createSession } from "@/app/_lib/session";
import OTP from "@/app/_schemas/otp.schema";
import dbConnect from "@/app/_lib/dbConnect";
import Cart from "@/app/_schemas/cart.schema";

export async function POST(request) {
    try {
        await dbConnect();
        const payload = await request.json();
        const { name, email, phone, password, otp } = payload;

        if ( !email || !password) {
            return ReE("Missing required fields", "email and password both required", 400);
        }

        const _user = await User.findOne({email})
        if (_user) 
            return ReE("Email already exists!", "Email ID already exists.", 401);
        
        const records = await OTP.find({ target: email, type: "signup" }).sort({ createdAt: -1 }).limit(1);
        const record = records?.[0];

        if (!record || Date.now() > new Date(record.expiresAt))
            return ReE("OTP expired or not found", "", 400);

        if (record.verified) 
            return ReE("OTP already verified", "", 400);

        if (!compareSync(otp, record.otpHash))
            return ReE("Invalid OTP", "", 400);
        
        const curr_password = hashSync(password, parseInt(process.env.SALT_ROUND));
        const user_id = "user-" + uuidv4();
        
        const user = new User({ name, email, phone, password: curr_password, user_id });
        const cart = await Cart.create({user_id, course_ids:[]})
        record.verified = true;
        await Promise.all([user.save(), record.save()]);
        await createSession({ user_id: user.user_id, role: user.role, cart_id: cart.cart_id })
        const userInfo = {
            user_id: user.user_id,
            cart_id: cart.cart_id,
        }
        return ReS("User registered successfully", userInfo, 201);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return ReE("Email already exists.", error, 400);
        }
        return ReE("An error occurred while registering user", error, 500);
    }
}