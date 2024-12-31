import express, { Request, Response } from "express";
import { VideoModel } from "../models/video.models";
import { CategoryModel } from "../models/category.models";
import { PlaylistModel } from "../models/playlist.models";
import mongoose from "mongoose";
import { WatchedVideoModel } from "../models/watchvideo.models";
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

    const category = req.query.category as string;
    const isPublic = req.query.isPublic === "true";
    const videoType = req.query.videoType as string;

    const filter: any = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      }
    }

    if (req.query.isPublic) {
      filter.isPublic = isPublic;
    }

    if (videoType && ["short", "long"].includes(videoType)) {
      filter.videoType = videoType;
    }

    const total = await VideoModel.countDocuments(filter);
    const videos = await VideoModel.find(filter)
      .select(
        "title videoThumbnail videoUrl isPublic publishedDate totalView videoType createdAt"
      )
      .limit(limit)
      .skip(skip)
      .populate("writer", "name avatar")
      .sort("-createdAt")
      .lean();

    return res.status(200).json({
      success: true,
      data: videos,
      totalPage: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getVideos = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 5, category, videoType, isPublic } = req.query;
    const perPage = parseInt(limit as any) || 5;
    const currentPage = parseInt(page as any) || 1;

    let query: any = {};

    if (category && category !== "null") {
      query.category = category;
    }

    if (videoType) {
      query.videoType = videoType;
    }
    if (isPublic !== undefined) {
      query.isPublic = isPublic === "true";
    }

    const skip = (currentPage - 1) * perPage;

    const videos = await VideoModel.find(query)
      .select(
        "title videoThumbnail videoUrl isPublic publishedDate totalView createdAt"
      )
      .populate("writer", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const totalCount = await VideoModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const hasMore = currentPage < totalPages;

    const headers = {
      "x-page": currentPage,
      "x-total-count": totalCount,
      "x-pages-count": totalPages,
      "x-per-page": perPage,
      "x-next-page": hasMore ? currentPage + 1 : null,
    };

    return res.status(200).json({
      success: true,
      data: videos,
      headers,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
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
      allowComments,
      category,
      playlist,
      tags,
      videoThumbnail,
      publishedDate,
      videoType,
    } = req.body;

    if (!title || !description || !videoUrl || !publishedDate || !videoType) {
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
      allowComments,
      category: validCategory,
      playlist: validPlaylist,
      tags,
      videoThumbnail,
      publishedDate,
      writer,
      videoType,
    });

    await newVideo.save();

    if (validPlaylist) {
      await PlaylistModel.findByIdAndUpdate(
        validPlaylist,
        { $push: { videos: newVideo._id } },
        { new: true }
      );
    }

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
      allowComments,
      category,
      playlist,
      tags,
      videoThumbnail,
      publishedDate,
      videoType,
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
        allowComments:
          typeof allowComments === "boolean"
            ? allowComments
            : video.allowComments,
        category: validCategory,
        playlist: validPlaylist,
        tags: tags || video.tags,
        videoThumbnail: videoThumbnail || video.videoThumbnail,
        publishedDate: publishedDate || video.publishedDate,
        videoType: videoType || video.videoType,
      },
      { new: true }
    );

    // Nếu playlist có thay đổi, cập nhật playlist
    if (video.playlist !== validPlaylist) {
      // Nếu video trước đó có playlist, xóa video khỏi playlist đó
      if (video.playlist) {
        await PlaylistModel.findByIdAndUpdate(
          video.playlist,
          { $pull: { videos: videoId } },
          { new: true }
        );
      }

      // Nếu validPlaylist không null, thêm video vào playlist mới
      if (validPlaylist) {
        await PlaylistModel.findByIdAndUpdate(
          validPlaylist,
          { $addToSet: { videos: videoId } },
          { new: true }
        );
      }
    }

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
      .sort("-totalView")
      .limit(12)
      .lean();

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

export const getTrendingVideos = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { page = 1, limit = 12, videoType } = req.query;
    const perPage = parseInt(limit as any) || 12;
    const currentPage = parseInt(page as any) || 1;

    let query: any = { isPublic: true };

    if (videoType) {
      query.videoType = videoType;
    }

    const skip = (currentPage - 1) * perPage;

    const trendingVideos = await VideoModel.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          trendScore: {
            $add: [
              { $multiply: ["$totalView", 1] },
              { $multiply: ["$likeCount", 2] },
              {
                $cond: [
                  {
                    $gte: [
                      "$publishedDate",
                      new Date(new Date().setDate(new Date().getDate() - 7)),
                    ],
                  },
                  10,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: { trendScore: -1, publishedDate: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: perPage,
      },
      {
        $project: {
          title: 1,
          videoThumbnail: 1,
          videoUrl: 1,
          isPublic: 1,
          publishedDate: 1,
          totalView: 1,
          createdAt: 1,
          writer: 1,
          category: 1,
        },
      },
    ]);

    const videosWithDetails = await VideoModel.populate(trendingVideos, [
      { path: "writer", select: "name avatar" },
      { path: "category", select: "title" },
    ]);

    const totalCount = await VideoModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const hasMore = currentPage < totalPages;

    const headers = {
      "x-page": currentPage,
      "x-total-count": totalCount,
      "x-pages-count": totalPages,
      "x-per-page": perPage,
      "x-next-page": hasMore ? currentPage + 1 : null,
    };

    return res.status(200).json({
      success: true,
      data: videosWithDetails,
      headers,
      hasMore,
    });
  } catch (error) {
    console.error("Error in getting trending videos:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
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

export const descView = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;

    if (watchTime >= 1) {
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

export const descViewAuth = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;
    const userId = req.userId as string | undefined;

    if (watchTime >= 1) {
      const updatedVideo = await VideoModel.findByIdAndUpdate(
        id,
        { $inc: { totalView: 1 } },
        { new: true }
      );

      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }

      if (userId) {
        const watchedVideoExists = await WatchedVideoModel.findOne({
          user: userId,
          video: id,
        });

        if (!watchedVideoExists) {
          await WatchedVideoModel.create({
            user: userId,
            video: id,
            watchTime,
          });
        } else {
          watchedVideoExists.watchTime = watchTime;
          await watchedVideoExists.save();
        }
      }
      return res.status(200).json({
        message: "View added and watch history updated",
        video: updatedVideo,
      });
    } else {
      return res.status(400).json({
        message: "Watch time must be at least 60 seconds",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const getWatchedVideos = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { videoType, page = 1, limit = 5 } = req.query;
  const perPage = parseInt(limit as any) || 5;
  const currentPage = parseInt(page as any) || 1;

  try {
    const twoWeeksAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    await WatchedVideoModel.deleteMany({
      user: userId,
      watchedAt: { $lt: twoWeeksAgo },
    });

    const skip = (currentPage - 1) * perPage;

    const pipeline: any[] = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "video",
        },
      },
      { $unwind: "$video" },
      {
        $match: videoType ? { "video.videoType": videoType } : {},
      },
      {
        $lookup: {
          from: "users",
          localField: "video.writer",
          foreignField: "_id",
          as: "video.writer",
        },
      },
      { $unwind: "$video.writer" },
      {
        $project: {
          video: 1,
        },
      },
      { $skip: skip },
      { $limit: perPage },
    ];

    const watchedVideos = await WatchedVideoModel.aggregate(pipeline);

    const totalCount = await WatchedVideoModel.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      ...(videoType ? { "video.videoType": videoType } : {}),
    });

    const totalPages = Math.ceil(totalCount / perPage);
    const hasMore = currentPage < totalPages;

    const headers = {
      "x-page": currentPage,
      "x-total-count": totalCount,
      "x-pages-count": totalPages,
      "x-per-page": perPage,
      "x-next-page": hasMore ? currentPage + 1 : null,
    };

    if (!watchedVideos.length) {
      return res.status(404).json({ message: "No watched videos found." });
    }

    res.status(200).json({
      success: true,
      data: watchedVideos,
      headers,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getVideobyId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
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
      return res.status(404).json({
        success: false,
        message: "Video not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getVideoRecommend = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const perPage = parseInt(limit as any) || 10;
  const currentPage = parseInt(page as any) || 1;

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

    const skip = (currentPage - 1) * perPage;

    let recommendedVideos = await VideoModel.find({
      _id: { $ne: id },
      videoType: { $ne: "short" },
      $or: [
        { category: currentVideo.category },
        { tags: { $in: currentVideo.tags } },
      ],
      isPublic: true,
    })
      .sort({ totalView: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("writer", "name avatar")
      .populate("tags", "name")
      .lean();

    if (recommendedVideos.length === 0) {
      recommendedVideos = await VideoModel.find({
        _id: { $ne: id },
        videoType: { $ne: "short" },
        isPublic: true,
      })
        .sort({ totalView: -1, publishedDate: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("writer", "name avatar")
        .populate("tags", "name")
        .lean();
    }

    const totalCount = await VideoModel.countDocuments({
      _id: { $ne: id },
      videoType: { $ne: "short" },
      $or: [
        { category: currentVideo.category },
        { tags: { $in: currentVideo.tags } },
      ],
      isPublic: true,
    });

    const totalPages = Math.ceil(totalCount / perPage);
    const hasMore = currentPage < totalPages;

    const headers = {
      "x-page": currentPage,
      "x-total-count": totalCount,
      "x-pages-count": totalPages,
      "x-per-page": perPage,
      "x-next-page": hasMore ? currentPage + 1 : null,
    };

    return res.status(200).json({
      success: true,
      data: recommendedVideos,
      headers,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserVideoCount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing user ID!",
      });
    }

    const videoCount = await VideoModel.countDocuments({ writer: userId });

    return res.status(200).json({
      success: true,
      videoCount,
    });
  } catch (error) {
    console.error("Error fetching user video count:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};
