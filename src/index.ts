import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";
import { ENV } from "./config/env.js";
import { connectDB } from "./db.js";
import { setupSockets } from "./utils/sockets.js";
import trendsRoute from "./routes/trends.js";
import sportsRoute from "./routes/sports.js";
import predictionsRoute from "./routes/predictions.js";
import authRoute from "./routes/auth.js";
import commentsRoute from "./routes/comments.js";
import leaderboardRoute from "./routes/leaderboard.js";
import { fetchAndStoreTrends } from "./services/trendsAdapter.js";
import { fetchUpcomingFootball } from "./services/sportsAdapter.js";
import { predictForUpcoming } from "./services/aiPredictor.js";
import newsRouter from "./routes/news.js";

const app = express();

// Security headers
app.use(helmet());

// Explicit CORS whitelist
const allowedOrigins = ENV.CLIENT_ORIGIN.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoute);
app.use("/api/trends", trendsRoute);
app.use("/api/sports", sportsRoute);
app.use("/api/predictions", predictionsRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/leaderboard", leaderboardRoute);
app.use("/api/news", newsRouter);

const server = http.createServer(app);
setupSockets(server);

// Start server after DB connect + background jobs
(async () => {
  await connectDB();
  const run = async () => {
    await fetchAndStoreTrends();
    await fetchUpcomingFootball(2);
    await predictForUpcoming();
  };
  await run();
  setInterval(run, 5 * 60 * 1000);
  server.listen(ENV.PORT, () =>
    console.log(`🚀 API http://localhost:${ENV.PORT}`)
  );
})();
