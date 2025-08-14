import axios from "axios";
import Trend from "../models/Trend.js";
import { ENV } from "../config/env.js";
import { quickSentiment } from "../utils/sentiment.js";

export async function fetchAndStoreTrends() {
  if (!ENV.NEWS_API_KEY) {
    const mocks = [
      { title: "Tech stocks surge after earnings", source: "MockNews", location: "US-CA", lat: 37.77, lng: -122.4, url: "", publishedAt: new Date(), tags: ["tech","stocks"] },
      { title: "Fuel price protests in Lagos", source: "MockNews", location: "NG-Lagos", lat: 6.5244, lng: 3.3792, url: "", publishedAt: new Date(), tags: ["economy","protest"] },
      { title: "Heatwave warnings across Europe", source: "MockNews", location: "EU", lat: 50.11, lng: 8.68, url: "", publishedAt: new Date(), tags: ["weather"] }
    ];
    for (const m of mocks) {
      const sentiment = quickSentiment(m.title);
      await Trend.findOneAndUpdate({ title: m.title, source: m.source }, { ...m, sentiment }, { upsert: true });
    }
    return;
  }
  const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=20`;
  const { data } = await axios.get(url, { headers: { "X-Api-Key": ENV.NEWS_API_KEY } });
  const items = (data?.articles || []).map((a: any) => ({
    title: a.title,
    source: a.source?.name || "NewsAPI",
    url: a.url,
    location: "GLOBAL",
    lat: 0, lng: 0,
    publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
    tags: [] as string[],
  }));
  for (const it of items) {
    const sentiment = quickSentiment(it.title);
    await Trend.findOneAndUpdate({ title: it.title, source: it.source }, { ...it, sentiment }, { upsert: true });
  }
}
