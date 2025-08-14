import axios from "axios";
import Match from "../models/Match.js";
import { ENV } from "../config/env.js";
export async function fetchUpcomingFootball(daysAhead = 2) {
    if (!ENV.RAPIDAPI_KEY) {
        const now = new Date();
        const fixtures = [
            { apiId: "M1", league: "Premier League", country: "England", date: new Date(now.getTime() + 86400000), status: "NS", homeTeam: "Arsenal", awayTeam: "Chelsea", homeOdds: 1.9, drawOdds: 3.4, awayOdds: 3.7, homeForm: [2, 1, 0, 1, 2], awayForm: [0, -1, 0, 1, -2] },
            { apiId: "M2", league: "La Liga", country: "Spain", date: new Date(now.getTime() + 172800000), status: "NS", homeTeam: "Barcelona", awayTeam: "Sevilla", homeOdds: 1.6, drawOdds: 4.0, awayOdds: 5.0, homeForm: [2, 2, 1, 1, 2], awayForm: [-1, 0, -2, 1, 0] }
        ];
        for (const f of fixtures) {
            await Match.findOneAndUpdate({ apiId: f.apiId }, f, { upsert: true });
        }
        return;
    }
    const today = new Date();
    const to = new Date(today.getTime() + daysAhead * 86400000).toISOString().slice(0, 10);
    const from = today.toISOString().slice(0, 10);
    const url = `https://${ENV.API_FOOTBALL_HOST}/fixtures?from=${from}&to=${to}`;
    const { data } = await axios.get(url, { headers: { 'x-rapidapi-key': ENV.RAPIDAPI_KEY, 'x-rapidapi-host': ENV.API_FOOTBALL_HOST } });
    const list = data?.response || [];
    for (const item of list) {
        const f = {
            apiId: String(item.fixture?.id),
            league: item.league?.name,
            country: item.league?.country,
            date: new Date(item.fixture?.date),
            status: item.fixture?.status?.short,
            homeTeam: item.teams?.home?.name,
            awayTeam: item.teams?.away?.name,
            homeOdds: undefined,
            drawOdds: undefined,
            awayOdds: undefined,
            homeForm: [], awayForm: []
        };
        await Match.findOneAndUpdate({ apiId: f.apiId }, f, { upsert: true });
    }
}
