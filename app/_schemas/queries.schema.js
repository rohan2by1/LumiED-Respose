import { model, models, Schema } from "mongoose";

const replySchema = new Schema({
  subject: {
    type: String
  },
  body: {
    type: String
  },
});

const querySchema = new Schema(
  {
    query_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      required: true,
    },
    reply: {
      type: replySchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Query = models.queries || model("queries", querySchema);

export default Query;
