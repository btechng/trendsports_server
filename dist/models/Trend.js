import { Schema, model } from "mongoose";
const TrendSchema = new Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    url: String,
    location: { type: String, index: true },
    lat: Number,
    lng: Number,
    sentiment: { type: Number, default: 0 },
    summary: String,
    tags: [String],
    publishedAt: Date
}, { timestamps: true });
export default model("Trend", TrendSchema);
