import { Router } from "express";
import Match from "../models/Match.js";
import Prediction from "../models/Prediction.js";
const r = Router();

r.get("/fixtures", async (req, res) => {
  const { days = 3 } = req.query as any;
  const to = new Date(Date.now() + Number(days)*86400000);
  const items = await Match.find({ date: { $lte: to } }).sort({ date: 1 }).limit(100);
  res.json(items);
});

r.get("/match/:id", async (req, res) => {
  const match = await Match.findById(req.params.id);
  const pred = await Prediction.findOne({ match: req.params.id });
  res.json({ match, prediction: pred });
});

export default r;
