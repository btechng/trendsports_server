import { Schema, model } from "mongoose";
const MatchSchema = new Schema({
  apiId: { type: String, index: true },
  league: String,
  country: String,
  date: Date,
  status: String,
  homeTeam: String,
  awayTeam: String,
  homeOdds: Number,
  drawOdds: Number,
  awayOdds: Number,
  homeForm: [Number],
  awayForm: [Number]
}, { timestamps: true });
export default model("Match", MatchSchema);
