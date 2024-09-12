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
    commentsCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
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
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VideoModel = mongoose.model("Video", VideoSchema);
