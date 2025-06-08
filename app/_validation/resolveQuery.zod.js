import { z } from "zod";

export const resolveQueryPayloadSchema = z.object({
  query_id: z.string(),
  subject: z.string().min(1),
  body: z.string().min(1),
});
