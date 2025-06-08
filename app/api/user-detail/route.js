import { getUserID } from "@/app/_lib/auth";
import dbConnect from "@/app/_lib/dbConnect";
import User from "@/app/_schemas/user.schema";
import { ReS, ReE } from "@/app/_utils/responseHandler.util"; // your custom response helpers

export async function GET() {
  try {
    const user_id = await getUserID();
    if (!user_id?.length) return user_id; 

    await dbConnect();
    
    const user = await User.findOne({user_id},
      {
        _id: 0,
        email: 1,
        phone: 1,
        name: 1,
      }
    );

    return ReS("Data fetched successfully", user, 200);
  } catch (error) {
    console.error(error);
    return ReE("An error occurred while fetching the user detail.", error, 500);
  }
}
