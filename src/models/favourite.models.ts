import mongoose, { Schema } from "mongoose";

const FavouriteSchema = new mongoose.Schema(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const FavouriteModel = mongoose.model("Favourite", FavouriteSchema);
