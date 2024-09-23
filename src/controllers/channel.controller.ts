import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/users.models";
import { VideoModel } from "../models/video.models";

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

export const getChannelVideo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const channelId = req.params.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 12;
  const skip = (page - 1) * limit;

  try {
    const total = await VideoModel.countDocuments({ writer: channelId });
    const videos = await VideoModel.find({ writer: channelId })
      .skip(skip)
      .limit(limit)
      .populate("writer")
      .sort("-createdAt");

    return res.json({
      success: true,
      videos,
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
