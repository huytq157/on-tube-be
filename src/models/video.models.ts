import mongoose, { Schema } from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    playlist: {
      type: Schema.Types.ObjectId,
      ref: "Playlist",
    },
    tags: [
      {
        type: String,
      },
    ],
    videoThumbnail: {
      type: String,
    },
    totalView: {
      type: Number,
      default: 0,
    },
    publishedDate: {
      type: Date,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    videoType: {
      type: String,
      enum: ["short", "long"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VideoModel = mongoose.model("Video", VideoSchema);
