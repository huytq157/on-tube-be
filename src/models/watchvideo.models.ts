import mongoose, { Schema } from "mongoose";

const WatchedVideoSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    watchTime: {
      type: Number,
      required: true,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const WatchedVideoModel = mongoose.model(
  "WatchedVideo",
  WatchedVideoSchema
);
