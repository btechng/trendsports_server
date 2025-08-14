import { Router } from "express";
import User from "../models/User.js";
const r = Router();
r.get("/", async (req, res) => {
    const top = await User.find({}, { passwordHash: 0 }).sort({ score: -1 }).limit(20);
    res.json(top);
});
export default r;
