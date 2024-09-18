import express, { Request, Response } from "express";
import { VideoModel } from "../models/video.models";
import { CategoryModel } from "../models/category.models";
import { PlaylistModel } from "../models/playlist.models";
import { TagModel } from "../models/tag.models";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}

export const getAllVideos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const cursor = req.query.cursor as string;

    const query: any = {};
    if (cursor) {
      query._id = { $gt: new mongoose.Types.ObjectId(cursor) };
    }

    const videos = await VideoModel.find(query)
      .limit(limit)
      .populate("writer", "name avatar")
      .sort("-createdAt");

    const nextCursor =
      videos.length > 0 ? videos[videos.length - 1]._id.toString() : null;

    return res.status(200).json({
      success: true,
      videos,
      nextCursor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

    const writer = req.userId;
    const newVideo = new VideoModel({
      title,
      description,
      videoUrl,
      isPublic,
      category: validCategory,
      playlist: validPlaylist,
      tags,
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

export const updateVideo = async (req: CustomRequest, res: Response) => {
  const videoId = req.params.id;
  const userId = req.userId;

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

    // Kiểm tra video có tồn tại và thuộc về người dùng hiện tại hay không
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found!",
      });
    }
    if (video.writer.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this video!",
      });
    }

    // Kiểm tra URL video có hợp lệ không
    if (videoUrl && !videoUrl.includes("http")) {
      return res.status(400).json({
        success: false,
        message: "Invalid video URL!",
      });
    }

    // Kiểm tra category có tồn tại không
    let validCategory = video.category;
    if (category && mongoose.Types.ObjectId.isValid(category)) {
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

    // Kiểm tra playlist có tồn tại không
    let validPlaylist = video.playlist;
    if (playlist && mongoose.Types.ObjectId.isValid(playlist)) {
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

    // Cập nhật video
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      {
        title: title || video.title,
        description: description || video.description,
        videoUrl: videoUrl || video.videoUrl,
        isPublic: typeof isPublic === "boolean" ? isPublic : video.isPublic,
        category: validCategory,
        playlist: validPlaylist,
        tags: tags || video.tags,
        videoThumbnail: videoThumbnail || video.videoThumbnail,
        publishedDate: publishedDate || video.publishedDate,
      },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    return res.status(200).json({
      success: true,
      message: "Video updated successfully!",
      data: updatedVideo,
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
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
      .populate("writer", "name email avatar")
      .sort("-totalView");
    // .limit(12)
    // .lean();

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
  } catch (error) {}
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

export const descView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;

    if (watchTime >= 60) {
      const updatedVideo = await VideoModel.findByIdAndUpdate(
        id,
        { $inc: { totalView: 1 } },
        { new: true }
      );

      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }

      return res
        .status(200)
        .json({ message: "View added", video: updatedVideo });
    } else {
      return res
        .status(400)
        .json({ message: "Watch time must be at least 60 seconds" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getVideobyId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  console.time("getVideobyId");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.timeEnd("getVideobyId");
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  try {
    const video = await VideoModel.findById(id)
      .populate("writer", "name avatar")
      .populate("tags", "name")
      .lean();

    if (!video) {
      console.timeEnd("getVideobyId");
      return res.status(404).json({
        success: false,
        message: "Video not found!",
      });
    }

    console.timeEnd("getVideobyId");

    return res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error(error);
    console.timeEnd("getVideobyId");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getVideoRecommend = async (req: Request, res: Response) => {
  const { id } = req.params; // Video ID hiện tại

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  try {
    const currentVideo = await VideoModel.findById(id).lean();

    if (!currentVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found!",
      });
    }

    // Lấy các video liên quan dựa trên cùng category hoặc tags
    let recommendedVideos = await VideoModel.find({
      _id: { $ne: id }, // Loại bỏ video hiện tại
      $or: [
        { category: currentVideo.category }, // Cùng category
        { tags: { $in: currentVideo.tags } }, // Hoặc có chung ít nhất 1 tag
      ],
      isPublic: true,
    })
      .sort({ totalView: -1 }) // Sắp xếp theo số lượt xem giảm dần
      .limit(10)
      .populate("writer", "name avatar")
      .populate("tags", "name")
      .lean();

    // Nếu không tìm được video nào trùng category hoặc tags
    if (recommendedVideos.length === 0) {
      recommendedVideos = await VideoModel.find({
        _id: { $ne: id }, // Loại bỏ video hiện tại
        isPublic: true,
      })
        .sort({ totalView: -1, publishedDate: -1 })
        .limit(10)
        .populate("writer", "name avatar")
        .populate("tags", "name")
        .lean();
    }

    return res.status(200).json({
      success: true,
      data: recommendedVideos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
