import mongoose from "mongoose";
import { ENV } from "./config/env.js";
export async function connectDB() {
    if (!ENV.MONGO_URI)
        throw new Error("MONGO_URI missing");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB connected");
}
