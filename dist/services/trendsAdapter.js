// src/services/trendsAdapter.ts
import axios from "axios";
import TrendModel from "../models/Trend"; // adjust path if needed
const API_KEY = process.env.GNEWS_API_KEY;
const MAX_RETRIES = 3;
async function fetchWithRetry(url, retries = MAX_RETRIES) {
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        if (retries > 0) {
            const delay = (MAX_RETRIES - retries + 1) * 1000;
            console.warn(`Request failed: ${error.message}. Retrying in ${delay}ms...`);
            await new Promise((res) => setTimeout(res, delay));
            return fetchWithRetry(url, retries - 1);
        }
        throw error;
    }
}
export async function fetchAndStoreTrends() {
    if (!API_KEY) {
        console.error("GNEWS_API_KEY is not set in .env");
        return;
    }
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&max=20&token=${API_KEY}`;
    try {
        const data = await fetchWithRetry(url);
        const articles = data.articles;
        if (!articles || articles.length === 0) {
            console.warn("No articles returned from GNews.");
            return;
        }
        // Optional: clear old trends
        await TrendModel.deleteMany({});
        // Save new trends
        const trendDocs = articles.map((article) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.image,
            source: article.source.name,
            publishedAt: new Date(article.publishedAt),
        }));
        await TrendModel.insertMany(trendDocs);
        console.log(`Fetched and stored ${trendDocs.length} GNews articles.`);
    }
    catch (error) {
        console.error("Failed to fetch/store GNews articles:", error.message);
    }
}
