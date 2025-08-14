import express from "express";
import axios from "axios";
const router = express.Router();
// GET /api/news/top-headlines
router.get("/top-headlines", async (req, res) => {
    try {
        // Optional: allow frontend to pass pageSize or language
        const { pageSize = 20, language = "en" } = req.query;
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: { pageSize, language },
            headers: {
                "X-Api-Key": process.env.NEWS_API_KEY || "",
            },
            timeout: 5000,
        });
        res.json(response.data);
    }
    catch (error) {
        console.error("NewsAPI fetch error:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Failed to fetch news data from NewsAPI",
            details: error.response?.data || error.message,
        });
    }
});
export default router;
