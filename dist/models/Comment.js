import { Schema, model, Types } from "mongoose";
const CommentSchema = new Schema({
    topicType: { type: String, enum: ["trend", "match"], required: true },
    topicId: { type: Types.ObjectId, required: true },
    authorId: { type: Types.ObjectId, ref: "User" },
    authorName: String,
    text: { type: String, required: true }
}, { timestamps: true });
export default model("Comment", CommentSchema);
