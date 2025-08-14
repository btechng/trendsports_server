import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    email: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    avatar: String,
    passwordHash: { type: String, required: true },
    score: { type: Number, default: 0 } // for leaderboard
}, { timestamps: true });
export default model("User", UserSchema);
