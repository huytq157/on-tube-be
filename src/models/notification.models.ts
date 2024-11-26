import mongoose, { Schema } from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: [mongoose.Schema.Types.ObjectId], required: true },
    from_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    video: { type: mongoose.Schema.Types.ObjectId, default: null },
    comment: { type: mongoose.Schema.Types.ObjectId, default: null },
    read: { type: Boolean, default: false },
    url: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = mongoose.model(
  "Notification",
  NotificationSchema
);
