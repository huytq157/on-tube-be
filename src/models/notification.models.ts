import mongoose, { Schema } from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export const NotificationModel = mongoose.model(
  "Notification",
  NotificationSchema
);
