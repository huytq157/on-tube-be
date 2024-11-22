import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
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
    comment: {
      type: String,
      required: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CommentModel = mongoose.model("Comment", CommentSchema);
