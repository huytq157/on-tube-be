import express, { Request, Response } from "express";
import { VideoModel } from "../models/video.models";
import { FavouriteModel } from "../models/favourite.models";

interface CustomRequest extends Request {
  userId?: string;
}

export const getVideoFavourite = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;

  try {
    const videoFavourites = await FavouriteModel.find({ userId }).sort(
      "-createdAt"
    );

    const videoIds = videoFavourites.map((favourite) => favourite.videoId);

    const videos = await VideoModel.find({ _id: { $in: videoIds } }).populate(
      "writer"
    );

    return res.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const addVideoFavourite = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const videoId: string = req.body.videoId;

  try {
    const checkVideoExists = await FavouriteModel.find({ userId, videoId });
    if (checkVideoExists.length > 0) {
      return res.json({
        success: false,
        message: "Video already exists in favourites!",
      });
    }

    const newVideoFavourite = new FavouriteModel({
      videoId,
      userId,
    });
    await newVideoFavourite.save();

    const video = await VideoModel.findOne({
      _id: newVideoFavourite.videoId,
    }).populate("writer");

    return res.json({
      success: true,
      message: "Video added to favourites successfully!",
      video,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const deleteVideoFavourite = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const videoId: string = req.params.videoId;

  try {
    const deleteVideo = await FavouriteModel.findOneAndDelete({
      videoId,
      userId,
    });

    if (deleteVideo) {
      return res.json({
        success: true,
        message: "Video đã được xóa khỏi danh sách yêu thích",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Video not found in favourites.",
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
