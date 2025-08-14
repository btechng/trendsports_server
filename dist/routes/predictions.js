import { Router } from "express";
import Prediction from "../models/Prediction.js";
const r = Router();
r.get("/", async (req, res) => {
    const items = await Prediction.find().sort({ createdAt: -1 }).limit(100).populate("match");
    res.json(items);
});
export default r;
