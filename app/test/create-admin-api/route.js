// app/test/create-admin-api
import dbConnect from "@/app/_lib/dbConnect";
import User from "@/app/_schemas/user.schema";
import { hashSync } from "bcrypt";

export async function GET() {
  await dbConnect();

  await User.syncIndexes();

  const data = {
    user_id: "admin_123",
    email: process.env.ADMIN_EMAIL,
    role: "admin",
    phone: "0123456789",
    name: "admin"
  };

  const userExists = await User.findOne(data);

  if (userExists)
    return Response.json(
      {
        success: true,
        message: `Admin user already exists.`,
      },
      { status: 200 }
    );

  data.password= hashSync(
    process.env.ADMIN_PASSWD,
    parseInt(process.env.SALT_ROUND)
  ),
  await User.create(data);

  return Response.json(
    {
      success: true,
      message: `Admin user created.`,
    },
    { status: 200 }
  );
}
