import express, { Request, Response } from "express";
import { PlaylistModel } from "../models/playlist.models";
import { VideoModel } from "../models/video.models";

interface CustomRequest extends Request {
  userId?: string;
}

export const addPlayList = async (req: CustomRequest, res: Response) => {
  const { title, description, isPublic } = req.body;
  const userId = req.userId;

  if (!title || !isPublic) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newPlaylist = new PlaylistModel({
      title,
      description,
      writer: userId,
      isPublic,
    });

    const savedPlaylist = await newPlaylist.save();

    res.status(201).json({
      message: "Playlist created successfully",
      playlist: savedPlaylist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPlayList = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;
  try {
    const playlists = await PlaylistModel.find({ writer: userId })
      .populate("writer", "name avatar")
      .populate({
        path: "videos",
        select: "title videoUrl writer videoThumbnail totalView",
        populate: {
          path: "writer",
          select: "name avatar",
        },
        options: {
          sort: { createdAt: -1 },
        },
      })
      .skip(skip)
      .limit(limit);
    const total = await PlaylistModel.countDocuments({
      writer: userId,
    });

    res.status(200).json({
      message: "Success",
      data: playlists,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveVideoToPlaylist = async (
  req: CustomRequest,
  res: Response
) => {
  const { playlistId, videoId } = req.body;
  const userId = req.userId;

  if (!playlistId || !videoId) {
    return res
      .status(400)
      .json({ message: "Playlist ID and Video ID are required" });
  }

  try {
    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      writer: userId,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found or you don't have permission to modify it",
      });
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoExistsInPlaylist = playlist.videos.some(
      (id) => id.toString() === videoId
    );

    if (videoExistsInPlaylist) {
      return res
        .status(400)
        .json({ message: "Video already exists in the playlist" });
    }

    playlist.videos.push(videoId);
    await playlist.save();

    if (video.playlist !== playlistId) {
      video.playlist = playlistId;
      await video.save();
    }

    res
      .status(200)
      .json({ message: "Video added to playlist successfully", playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeVideoFromPlaylist = async (
  req: CustomRequest,
  res: Response
) => {
  const { playlistId, videoId } = req.body;
  const userId = req.userId;

  if (!playlistId || !videoId) {
    return res
      .status(400)
      .json({ message: "Playlist ID and Video ID are required" });
  }

  try {
    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      writer: userId,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found or you don't have permission to modify it",
      });
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoIndexInPlaylist = playlist.videos.indexOf(videoId);

    if (videoIndexInPlaylist === -1) {
      return res
        .status(400)
        .json({ message: "Video not found in the playlist" });
    }

    playlist.videos.splice(videoIndexInPlaylist, 1);
    await playlist.save();

    if (video.playlist === playlistId) {
      video.playlist = null;
      await video.save();
    }

    res
      .status(200)
      .json({ message: "Video removed from playlist successfully", playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePlaylist = async (req: CustomRequest, res: Response) => {
  const playlistId = req.params.id;
  const { title, description, isPublic } = req.body;
  const userId = req.userId;

  if (!playlistId) {
    return res.status(400).json({ message: "Playlist ID is required" });
  }

  if (!title && !description && typeof isPublic === "undefined") {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      writer: userId,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found or you don't have permission to update",
      });
    }

    if (title) playlist.title = title;
    if (description) playlist.description = description;
    if (typeof isPublic !== "undefined") playlist.isPublic = isPublic;

    const updatedPlaylist = await playlist.save();

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlaylistDetails = async (req: CustomRequest, res: Response) => {
  const playlistId = req.params.id;
  const userId = req.userId;

  if (!playlistId) {
    return res.status(400).json({ message: "Playlist ID is required" });
  }

  try {
    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      writer: userId,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found or you don't have permission to view",
      });
    }

    const videoDetails = await VideoModel.find({
      _id: { $in: playlist.videos },
    })
      .select(
        "videoUrl title videoThumbnail isPublic writer totalView createdAt"
      )
      .populate({
        path: "writer",
        select: "name avatar",
      });

    res.status(200).json({
      message: "Playlist details retrieved successfully",
      data: {
        ...playlist.toObject(),
        videos: videoDetails,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlaylistById = async (req: CustomRequest, res: Response) => {
  const playlistId = req.params.id;

  if (!playlistId) {
    return res.status(400).json({ message: "Playlist ID is required" });
  }

  try {
    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
    }).populate({
      path: "writer",
      select: "name",
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found or you don't have permission to view",
      });
    }

    const videoDetails = await VideoModel.find({
      _id: { $in: playlist.videos },
    })
      .select(
        "videoUrl title videoThumbnail isPublic writer totalView createdAt"
      )
      .populate({
        path: "writer",
        select: "name avatar",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Playlist details retrieved successfully",
      playlist: {
        ...playlist.toObject(),
        videos: videoDetails,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePlayList = async (req: CustomRequest, res: Response) => {
  const playlistId = req.params.id;
  const userId = req.userId;

  try {
    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      writer: userId,
    });

    if (!playlist) {
      return res.status(404).json({
        message:
          "Playlist not found or you're not authorized to delete this playlist",
      });
    }

    await PlaylistModel.deleteOne({ _id: playlistId });

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
