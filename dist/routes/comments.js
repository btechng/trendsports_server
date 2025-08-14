import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
const r = Router();
r.get("/:topicType/:topicId", async (req, res) => {
    const { topicType, topicId } = req.params;
    const list = await Comment.find({ topicType, topicId }).sort({ createdAt: -1 }).limit(200);
    res.json(list);
});
r.post("/:topicType/:topicId", auth, async (req, res) => {
    const { topicType, topicId } = req.params;
    const { text } = req.body || {};
    if (!text || text.length < 2)
        return res.status(400).json({ error: "Text required" });
    const comment = await Comment.create({ topicType, topicId, authorId: req.user.id, authorName: req.user.name, text });
    // reward participation
    await User.findByIdAndUpdate(req.user.id, { $inc: { score: 1 } });
    res.json(comment);
});
export default r;
