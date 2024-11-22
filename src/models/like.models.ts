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
      // required: true,
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
// Đảm bảo rằng user chỉ có thể like hoặc dislike một comment cụ thể
LikeSchema.index({ user: 1, comment: 1 }, { unique: true });

export const LikeModel = mongoose.model("Like", LikeSchema);
