import { Schema, model, Types } from "mongoose";
const PredictionSchema = new Schema({
  match: { type: Types.ObjectId, ref: "Match", required: true },
  user: { type: Types.ObjectId, ref: "User" }, // optional if later allow user picks
  method: { type: String, default: "heuristic" },
  probs: { home: Number, draw: Number, away: Number },
  pick: String,
  explanation: String
}, { timestamps: true });
export default model("Prediction", PredictionSchema);
