import { Router } from "express";
import Trend from "../models/Trend.js"; // model only used inside the route

const r = Router();

r.get("/", async (req, res) => {
  const { q, limit = 50 } = req.query as any;
  const filter: any = {};
  if (q) filter.title = { $regex: String(q), $options: "i" };
  const items = await Trend.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit));
  res.json(items);
});

export default r; // ✅ export the router, NOT the model
