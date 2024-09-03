import mongoose, { Schema } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export const CategoryModel = mongoose.model("Category", CategorySchema);
