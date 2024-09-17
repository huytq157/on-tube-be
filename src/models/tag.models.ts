import mongoose, { Schema } from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TagModel = mongoose.model("Tag", TagSchema);
