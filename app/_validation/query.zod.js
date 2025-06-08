import { z } from "zod";

export const queryPayloadSchema = z.object({
  email: z.string().email(),
  query: z.string().min(1),
  name: z.string().optional(),
});
