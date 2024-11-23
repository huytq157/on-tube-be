import mongoose, { Schema } from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

LikeSchema.index({ user: 1, video: 1 }, { unique: true });

export const LikeModel = mongoose.model("Like", LikeSchema);
