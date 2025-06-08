import { compareSync } from "bcrypt";

import User from "@/app/_schemas/user.schema";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import { createSession } from "@/app/_lib/session";
import dbConnect from "@/app/_lib/dbConnect";
import Cart from "@/app/_schemas/cart.schema";

export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const password = (formData.get("password"));
        const email = (formData.get("email"));

        if (!email || !password) {
            return ReE("Missing required fields", "Email and password are both required to proceed.", 400);
        }

        const user = await User.findOne({email})
        if (!user) {
            return ReE("Invalid credentials", "The provided email or password is incorrect.", 401);
        }
        const hash = user?.password;

        if(!compareSync(password, hash)){
            return ReE("Invalid credentials", "The provided email or password is incorrect.", 401);
        }
        let cart = await Cart.findOne({user_id: user.user_id, status: "active"});
        if(!cart){
            cart = await Cart.create({user_id: user.user_id});
        }
        await createSession({ user_id: user.user_id, role: user.role, cart_id: cart.cart_id })
        const userInfo = {
            user_id: user.user_id,
            role: user.role
        } 
        return ReS("User login successfully", userInfo, 201);
    } catch (error) {
        console.error(error)
        return ReE("An error occurred while login user", error, 500);
    }
}
