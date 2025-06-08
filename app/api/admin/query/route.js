import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import Query from "@/app/_schemas/queries.schema";
import { resolveQueryPayloadSchema } from "@/app/_validation/resolveQuery.zod";
import { sendMail } from "@/app/_lib/mail/sendMail";
import dbConnect from "@/app/_lib/dbConnect";
import { adminAuth } from "@/app/_lib/auth";

export async function POST(request) {
  try {
    const authError = await adminAuth();
    if (authError) 
      return authError;
    dbConnect();
    const { query_id, subject, body } = await request.json();

    if (!query_id || !subject || !body)
      return ReE(
        "Missing required fields",
        "email and query are required",
        400
      );

    const data = { subject, body };

    const query = await Query.findOne({ query_id });
    if (!query) 
        return ReE("Query not found", null, 404);
    if (query.status === "closed")
      return ReE("Query already resolved", null, 400);

    const zodValidation = resolveQueryPayloadSchema.safeParse({query_id, subject, body});
    if (!zodValidation.success) {
      return ReE("Validation Error", zodValidation.error.errors, 400);
    }

    query.status = "closed";
    query.reply = data;

    await Promise.all([query.save(), sendMail({to: query.email, data})]);
    return ReS("Query resolved successfully", null, 200);
  } catch (error) {
    console.error("Error sending email:", error);
    return ReE("Failed to send email", error.message, 500);
  }
}

export async function GET(request) {
  try {
    const authError = await adminAuth();
    if (authError) 
      return authError;
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const sortParam = searchParams.get("sort"); // "old" or "new"
    const statusParam = searchParams.get("status"); // "open", "closed"

    const filter = {};
    if (statusParam && statusParam !== "all") {
      filter.status = statusParam;
    }

    const queries = await Query.find(filter, { _id: 0, updatedAt: 0, reply: 0 }).sort({ createdAt:  (sortParam && sortParam === "old") ? 1 : -1 });

    if (!queries || queries.length === 0) {
      return ReE("No queries found", null, 404);
    }

    return ReS("Queries fetched successfully", queries, 200);
  } catch (error) {
    console.error("Error fetching queries:", error);
    return ReE("Failed to fetch queries", error.message || error, 500);
  }
}
