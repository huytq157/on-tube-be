import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export const CommentModel = mongoose.model("Comment", CommentSchema);
