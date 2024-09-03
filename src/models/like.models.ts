import mongoose, { Schema } from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    type: {
      type: String,
      enum: ["LIKE", "DISLIKE"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LikeModel = mongoose.model("Like", LikeSchema);
