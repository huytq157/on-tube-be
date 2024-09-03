import express, { Request, Response } from "express";
import { PlaylistModel } from "../models/playlist.models";
import { VideoModel } from "../models/video.models";

interface CustomRequest extends Request {
  userId?: string;
}

export const addPlayList = async (req: CustomRequest, res: Response) => {
  const { title, description, videos, isPublic } = req.body;
  const userId = req.userId;

  if (!title || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newPlaylist = new PlaylistModel({
      title,
      description,
      writer: userId,
      videos,
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

  try {
    const playlists = await PlaylistModel.find({ writer: userId })
      .populate("writer", "name email")
      .populate("videos", "title description");

    res.status(200).json({ message: "Success", playlists });
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
