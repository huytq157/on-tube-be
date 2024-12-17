import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/users.models";
import { VideoModel } from "../models/video.models";
import { PlaylistModel } from "../models/playlist.models";

export const getChannelInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const channelId = req.params.id;

  try {
    const channel = await UserModel.findOne({ _id: channelId }).select(
      "-password"
    );
    if (!channel) {
      return res.status(400).json({
        success: false,
        message: "Channel not found!",
      });
    }

    return res.json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const getChannelVideo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const channelId = req.params.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 12;
  const skip = (page - 1) * limit;
  const isPublic = req.query.isPublic === "true";

  try {
    const total = await VideoModel.countDocuments({
      writer: channelId,
      isPublic: isPublic,
    });
    const videos = await VideoModel.find({
      writer: channelId,
      isPublic: isPublic,
    })
      .select(
        "title videoThumbnail videoUrl isPublic publishedDate totalView createdAt videoType likeCount dislikeCount allowComments"
      )
      .skip(skip)
      .limit(limit)
      .populate("writer")
      .sort("-createdAt");

    return res.json({
      success: true,
      data: videos,
      totalPage: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const getChannelPlaylist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const channelId = req.params.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 12;
  const skip = (page - 1) * limit;
  const isPublic = req.query.isPublic === "true";

  try {
    const total = await PlaylistModel.countDocuments({
      writer: channelId,
      isPublic: isPublic,
    });

    const playlists = await PlaylistModel.find({
      writer: channelId,
      isPublic: isPublic,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "writer",
        select: "_id name avatar",
      })
      .populate({
        path: "videos",
        populate: {
          path: "writer",
          select: "_id name avatar",
        },
        select: "_id title videoUrl videoThumbnail totalView",
        options: {
          sort: { createdAt: -1 },
        },
      })
      .sort("-createdAt");

    return res.json({
      success: true,
      playlists,
      totalPage: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const searchChannel = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;

  if (!searchTerm || !searchTerm.trim()) {
    return res.status(400).json({
      success: false,
      message: "Missing parameters!",
    });
  }

  try {
    const textReg = new RegExp(searchTerm.trim(), "i");
    const results = await UserModel.find({
      name: textReg,
    })
      .select("name email avatar")
      .sort("-subscribersCount")
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
      message: "An error occurred while searching for channels.",
    });
  }
};

export const updateChannel = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const channelId = req.params.id;
  const { name, avatar, background, description } = req.body;

  try {
    const channel = await UserModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found!",
      });
    }

    if (name) channel.name = name;
    if (avatar) channel.avatar = avatar;
    if (background) channel.background = background;
    if (description) channel.description = description;

    await channel.save();

    return res.json({
      success: true,
      channel,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};
