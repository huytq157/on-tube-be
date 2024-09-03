import mongoose, { Schema } from "mongoose";

const RecommendationSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export const RecommendationtModel = mongoose.model(
  "Recommendation",
  RecommendationSchema
);
