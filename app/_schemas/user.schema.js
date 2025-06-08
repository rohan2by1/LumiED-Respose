import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
}, { timestamps: true });

const User = models.users || model("users", userSchema);

export default User;