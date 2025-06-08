import dbConnect from "@/app/_lib/dbConnect";

export async function GET() {
    dbConnect()
    return Response.json({
        success: true,
        message: `Server is running on ${process.env.NODE_ENV}`
    }, { status: 200 });
}