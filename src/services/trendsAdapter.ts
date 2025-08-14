// src/services/trendsAdapter.ts
import axios from "axios";

const NEWS_API_URL =
  "https://newsapi.org/v2/top-headlines?language=en&pageSize=20";
const API_KEY = process.env.NEWS_API_KEY || "";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

async function fetchWithRetry(
  url: string,
  headers: any,
  retries = 3,
  delay = 1000
): Promise<any> {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (err: any) {
    if (retries > 0) {
      console.warn(`Request failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return fetchWithRetry(url, headers, retries - 1, delay * 2); // exponential backoff
    } else {
      throw err; // after all retries fail
    }
  }
}

export async function fetchAndStoreTrends(): Promise<Article[]> {
  const headers = {
    "X-Api-Key": API_KEY,
    Accept: "application/json",
    "User-Agent": "axios/1.11.0",
  };

  try {
    const data = await fetchWithRetry(NEWS_API_URL, headers);
    if (!data.articles) return [];

    // Optionally: save articles to DB here
    return data.articles as Article[];
  } catch (err) {
    console.error("Failed to fetch NewsAPI articles after retries:", err);
    return []; // return empty array so server continues running
  }
}
