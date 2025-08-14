import axios from "axios";
import Match from "../models/Match.js";
import { ENV } from "../config/env.js";

export async function fetchUpcomingFootball(daysAhead = 2) {
  if (!ENV.FOOTBALL_DATA_KEY) {
    // Dummy fallback
    const now = new Date();
    const fixtures = [
      {
        apiId: "M1",
        league: "Premier League",
        country: "England",
        date: new Date(now.getTime() + 86400000),
        status: "NS",
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        homeOdds: 1.9,
        drawOdds: 3.4,
        awayOdds: 3.7,
        homeForm: [2, 1, 0, 1, 2],
        awayForm: [0, -1, 0, 1, -2],
      },
      {
        apiId: "M2",
        league: "La Liga",
        country: "Spain",
        date: new Date(now.getTime() + 172800000),
        status: "NS",
        homeTeam: "Barcelona",
        awayTeam: "Sevilla",
        homeOdds: 1.6,
        drawOdds: 4.0,
        awayOdds: 5.0,
        homeForm: [2, 2, 1, 1, 2],
        awayForm: [-1, 0, -2, 1, 0],
      },
    ];
    for (const f of fixtures) {
      await Match.findOneAndUpdate({ apiId: f.apiId }, f, { upsert: true });
    }
    return;
  }

  // Football-Data.org API fetch
  const today = new Date();
  const toDate = new Date(today);
  toDate.setDate(today.getDate() + daysAhead);

  const fromStr = today.toISOString().split("T")[0];
  const toStr = toDate.toISOString().split("T")[0];

  try {
    const response = await axios.get(
      `https://api.football-data.org/v4/matches`,
      {
        headers: { "X-Auth-Token": ENV.FOOTBALL_DATA_KEY },
        params: { dateFrom: fromStr, dateTo: toStr },
      }
    );

    const matches = response.data.matches || [];
    for (const item of matches) {
      const f = {
        apiId: String(item.id),
        league: item.competition?.name,
        country: item.competition?.area?.name,
        date: new Date(item.utcDate),
        status: item.status,
        homeTeam: item.homeTeam?.name,
        awayTeam: item.awayTeam?.name,
        homeOdds: undefined as number | undefined,
        drawOdds: undefined as number | undefined,
        awayOdds: undefined as number | undefined,
        homeForm: [],
        awayForm: [],
      };
      await Match.findOneAndUpdate({ apiId: f.apiId }, f, { upsert: true });
    }

    console.log(
      `Fetched and stored ${matches.length} upcoming matches from Football-Data.org`
    );
  } catch (error: any) {
    console.error("Failed to fetch upcoming football:", error.message);
  }
}
