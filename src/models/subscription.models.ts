import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export const SubscriptionModel = mongoose.model(
  "Subscription",
  SubscriptionSchema
);
