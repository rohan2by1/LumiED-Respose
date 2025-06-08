import { v4 as uuidv4 } from "uuid";
import { ReS, ReE } from "@/app/_utils/responseHandler.util";
import { queryPayloadSchema } from "@/app/_validation/query.zod";
import Query from "@/app/_schemas/queries.schema";
import dbConnect from "@/app/_lib/dbConnect";

export async function POST(request) {
  await dbConnect();
  try {
    const queryPayload = await request.json();

    if (!queryPayload || !queryPayload.email || !queryPayload.query)
      return ReE("Missing required fields","email and query are required",400);

    const zodValidation = queryPayloadSchema.safeParse(queryPayload);
    if (!zodValidation.success) {
      return ReE("Validation Error", zodValidation.error.errors, 400);
    }

    const query_id = `query-${uuidv4()}`;
    queryPayload.query_id = query_id;

    const newQuery = new Query(queryPayload);
    await newQuery.save();

    return ReS("Query submitted successfully", { query_id: newQuery.query_id }, 201);
  } catch (error) {
    console.error("Error submitting query:", error);
    return ReE("Failed to submit query", error.message || error, 500);
  }
}
