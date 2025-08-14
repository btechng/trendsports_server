import { Schema, model, Document } from "mongoose";

export interface ITrend extends Document {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  source?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const trendSchema = new Schema<ITrend>(
  {
    title: { type: String },
    description: { type: String },
    url: { type: String },
    imageUrl: { type: String },
    source: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const TrendModel = model<ITrend>("Trend", trendSchema);

export default TrendModel;
