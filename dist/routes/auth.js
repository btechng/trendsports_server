import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import { ENV } from "../config/env.js";
const r = Router();
const authSchema = z.object({ email: z.string().email(), name: z.string().min(2), password: z.string().min(6) });
r.post("/register", async (req, res) => {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const { email, name, password } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash });
    const token = jwt.sign({ id: user._id, email, name }, ENV.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email, name, score: user.score } });
});
r.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, ENV.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, score: user.score } });
});
export default r;
