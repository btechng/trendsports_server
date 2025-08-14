import dotenv from "dotenv";
dotenv.config();
export const ENV = {
  PORT: parseInt(process.env.PORT || "4000"),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI!,
  JWT_SECRET: process.env.JWT_SECRET || "devsecret",
  NEWS_API_KEY: process.env.NEWS_API_KEY || "",
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || "",
  API_FOOTBALL_HOST: process.env.API_FOOTBALL_HOST || "v3.football.api-sports.io",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
};
