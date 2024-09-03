import mongoose, { Schema } from "mongoose";

const TagSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export const TagModel = mongoose.model("Tag", TagSchema);
