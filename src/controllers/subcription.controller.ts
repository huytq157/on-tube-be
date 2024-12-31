import express, { Request, Response } from "express";
import { SubscriptionModel } from "../models/subscription.models";
import { NotificationModel } from "../models/notification.models";
import { UserModel } from "../models/users.models";
import { VideoModel } from "../models/video.models";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}

export const subscriptionChannel = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required.",
      });
    }

    const channel = await UserModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found.",
      });
    }

    const existingSubscription = await SubscriptionModel.findOne({
      userId: userId,
      channelId: channelId,
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký kênh này.",
      });
    }

    const newSubscription = new SubscriptionModel({
      userId: userId,
      channelId: channelId,
    });

    await newSubscription.save();

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server lỗi",
    });
  }
};

export const getSubscribedChannels = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    const subscriptions = await SubscriptionModel.find({ userId }).populate(
      "channelId",
      "name avatar email description"
    );

    const subscribedChannels = subscriptions.map((sub) => sub.channelId);

    return res.json({
      success: true,
      data: subscribedChannels,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server lỗi",
    });
  }
};

export const unsubscribeChannel = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required.",
      });
    }

    const subscription = await SubscriptionModel.findOneAndDelete({
      userId: userId,
      channelId: channelId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Bạn chưa đăng ký kênh này.",
      });
    }

    const exitsubcription = SubscriptionModel.findOneAndDelete({
      userId: userId,
      channelId: channelId,
    });

    await NotificationModel.deleteMany({
      from_user: userId,
      user: { $elemMatch: { $eq: channelId } },
      message: { $regex: "subscribed to your channel" },
      url: null,
      read: false,
      comment: null,
      video: null,
    });

    return res.json({
      success: true,
      message: "Hủy đăng ký thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server lỗi",
    });
  }
};

export const checkSubscription = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required.",
      });
    }

    const subscription = await SubscriptionModel.findOne({
      userId: userId,
      channelId: channelId,
    });

    if (subscription) {
      return res.json({
        success: true,
        subscribed: true,
        message: "Đã đăng ký kênh  này",
      });
    } else {
      return res.json({
        success: true,
        subscribed: false,
        message: "Chưa đăng ký kênh này",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server lỗi",
    });
  }
};

export const getSubscribedChannelVideos = async (
  req: CustomRequest,
  res: Response
) => {
  const { videoType, page = 1, limit = 10 } = req.query;
  const perPage = parseInt(limit as any) || 10;
  const currentPage = parseInt(page as any) || 1;

  try {
    const userId = req.userId;

    const subscriptions = await SubscriptionModel.find({ userId }).select(
      "channelId"
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Chưa đăng ký bất kỳ kênh nào.",
      });
    }

    const subscribedChannelIds = subscriptions.map((sub) => sub.channelId);

    const filter: Record<string, any> = {
      writer: { $in: subscribedChannelIds },
      isPublic: true,
    };

    if (videoType) {
      filter.videoType = videoType;
    }

    // Calculate skip value for pagination
    const skip = (currentPage - 1) * perPage;

    const videos = await VideoModel.find(filter)
      .select("title videoUrl videoThumbnail createdAt totalView writer")
      .populate("writer", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();

    const totalCount = await VideoModel.countDocuments(filter);
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
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getChannelSubscribersCount = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required.",
      });
    }

    const channelExists = await UserModel.exists({ _id: channelId });
    if (!channelExists) {
      return res.status(404).json({
        success: false,
        message: "Channel not found.",
      });
    }

    const subscriberCount = await SubscriptionModel.countDocuments({
      channelId,
    });

    return res.status(200).json({
      success: true,
      count: subscriberCount,
    });
  } catch (error) {
    console.error("Error in getChannelSubscribersCount:", error);
    return res.status(500).json({
      success: false,
      message: "Server lỗi",
    });
  }
};
