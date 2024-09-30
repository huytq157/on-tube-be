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
  },
  {
    timestamps: true,
  }
);

export const CommentModel = mongoose.model("Comment", CommentSchema);
