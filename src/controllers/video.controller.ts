import express, { Request, Response } from "express";
import { VideoModel } from "../models/video.models";
import { CategoryModel } from "../models/category.models";
import { PlaylistModel } from "../models/playlist.models";
import { TagModel } from "../models/tag.models";
import { LikeModel } from "../models/like.models";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}

export const getAllVideos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const skip = (page - 1) * limit;

    const total = await VideoModel.countDocuments();

    const videos = await VideoModel.find()
      .limit(limit)
      .skip(skip)
      .populate("writer")
      .sort("-createdAt");

    return res.status(200).json({
      success: true,
      videos,
      totalPage: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const searchVideo = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;

  if (!searchTerm || !searchTerm.trim()) {
    return res.status(400).json({
      success: false,
      message: "Missing parameters!",
    });
  }

  try {
    const textReg = new RegExp(searchTerm.trim(), "i");
    const results = await VideoModel.find({
      title: textReg,
    })
      .populate("writer")
      .sort("-totalView");

    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for videos.",
    });
  }
};

export const getTrendingVideos = async (req: Request, res: Response) => {
  try {
    const trendingVideos = await VideoModel.find({ isPublic: true })
      .sort({ totalView: -1, createdAt: -1 })
      .limit(10);

    if (!trendingVideos || trendingVideos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trending videos found!",
      });
    }

    return res.json({
      success: true,
      data: trendingVideos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const deleteVideo = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const _id = req.params.id;
  const userId = req.userId as string;

  try {
    const videoToDelete = await VideoModel.findOne({ _id });

    if (!videoToDelete) {
      return res.status(404).json({
        success: false,
        message: "Video not found!",
      });
    }

    if (videoToDelete.writer.toString() === userId) {
      const deletedVideo = await VideoModel.findOneAndDelete({ _id });
      if (deletedVideo) {
        return res.json({
          success: true,
          message: "Delete success!",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to delete the video!",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa video này!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const addVideo = async (req: CustomRequest, res: Response) => {
  if (!req.body.videoUrl.includes("")) {
    return res.status(400).json({
      success: false,
      message: "You do not have permission to upload videos!",
    });
  }

  try {
    const {
      title,
      description,
      videoUrl,
      isPublic,
      category,
      playlist,
      tags,
      videoThumbnail,
      publishedDate,
    } = req.body;

    if (!title || !description || !videoUrl || !publishedDate) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided!",
      });
    }

    if (!videoUrl.includes("http")) {
      return res.status(400).json({
        success: false,
        message: "Invalid video URL!",
      });
    }

    let validCategory = null;
    if (
      category &&
      category.trim() !== "" &&
      mongoose.Types.ObjectId.isValid(category)
    ) {
      const categoryExists = await CategoryModel.findById(category);
      if (categoryExists) {
        validCategory = category;
      } else {
        return res.status(400).json({
          success: false,
          message: "Category does not exist!",
        });
      }
    }

    let validPlaylist = null;
    if (
      playlist &&
      playlist.trim() !== "" &&
      mongoose.Types.ObjectId.isValid(playlist)
    ) {
      const playlistExists = await PlaylistModel.findById(playlist);
      if (playlistExists) {
        validPlaylist = playlist;
      } else {
        return res.status(400).json({
          success: false,
          message: "Playlist does not exist!",
        });
      }
    }

    const validTags = [];
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (mongoose.Types.ObjectId.isValid(tag)) {
          const tagExists = await TagModel.findById(tag);
          if (tagExists) {
            validTags.push(tag);
          } else {
            return res.status(400).json({
              success: false,
              message: `Tag with ID ${tag} does not exist!`,
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: `Invalid tag ID ${tag}!`,
          });
        }
      }
    }

    const writer = req.userId;
    const newVideo = new VideoModel({
      title,
      description,
      videoUrl,
      isPublic,
      category: validCategory,
      playlist: validPlaylist,
      tags: validTags,
      videoThumbnail,
      publishedDate,
      writer,
    });

    await newVideo.save();

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully!",
      data: newVideo,
    });
  } catch (error) {
    console.error("Error adding video:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

export const LikeVideo = async (req: CustomRequest, res: Response) => {
  const { videoId, type } = req.body;
  const userId = req.userId as string;

  if (!videoId || !type || !["LIKE", "DISLIKE"].includes(type)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const existingLike = await LikeModel.findOne({
      user: userId,
      video: videoId,
    });

    if (existingLike) {
      if (existingLike.type === type) {
        await LikeModel.deleteOne({ _id: existingLike._id });
      } else {
        await LikeModel.updateOne({ _id: existingLike._id }, { type });
      }
    } else {
      await LikeModel.create({ user: userId, video: videoId, type });
    }

    const likesCount = await LikeModel.countDocuments({
      video: videoId,
      type: "LIKE",
    });
    const dislikesCount = await LikeModel.countDocuments({
      video: videoId,
      type: "DISLIKE",
    });

    await VideoModel.findByIdAndUpdate(videoId, {
      likesCount,
      dislikesCount,
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
