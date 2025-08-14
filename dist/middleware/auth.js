import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
export function auth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: "No token" });
    try {
        const payload = jwt.verify(token, ENV.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email, name: payload.name };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
