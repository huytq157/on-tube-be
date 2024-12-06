"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelSubscribersCount = exports.getSubscribedChannelVideos = exports.checkSubscription = exports.unsubscribeChannel = exports.getSubscribedChannels = exports.subscriptionChannel = void 0;
const subscription_models_1 = require("../models/subscription.models");
const notification_models_1 = require("../models/notification.models");
const users_models_1 = require("../models/users.models");
const video_models_1 = require("../models/video.models");
const subscriptionChannel = async (req, res) => {
    try {
        const { channelId } = req.body;
        const userId = req.userId;
        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: "Channel ID is required.",
            });
        }
        const channel = await users_models_1.UserModel.findById(channelId);
        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found.",
            });
        }
        const existingSubscription = await subscription_models_1.SubscriptionModel.findOne({
            userId: userId,
            channelId: channelId,
        });
        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đăng ký kênh này.",
            });
        }
        const newSubscription = new subscription_models_1.SubscriptionModel({
            userId: userId,
            channelId: channelId,
        });
        await newSubscription.save();
        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server lỗi",
        });
    }
};
exports.subscriptionChannel = subscriptionChannel;
const getSubscribedChannels = async (req, res) => {
    try {
        const userId = req.userId;
        const subscriptions = await subscription_models_1.SubscriptionModel.find({ userId }).populate("channelId", "name avatar email description");
        const subscribedChannels = subscriptions.map((sub) => sub.channelId);
        return res.json({
            success: true,
            data: subscribedChannels,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server lỗi",
        });
    }
};
exports.getSubscribedChannels = getSubscribedChannels;
const unsubscribeChannel = async (req, res) => {
    try {
        const userId = req.userId;
        const { channelId } = req.body;
        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: "Channel ID is required.",
            });
        }
        const subscription = await subscription_models_1.SubscriptionModel.findOneAndDelete({
            userId: userId,
            channelId: channelId,
        });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Bạn chưa đăng ký kênh này.",
            });
        }
        const exitsubcription = subscription_models_1.SubscriptionModel.findOneAndDelete({
            userId: userId,
            channelId: channelId,
        });
        console.log("Exitsubcription", exitsubcription);
        await notification_models_1.NotificationModel.deleteMany({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server lỗi",
        });
    }
};
exports.unsubscribeChannel = unsubscribeChannel;
const checkSubscription = async (req, res) => {
    try {
        const userId = req.userId;
        const { channelId } = req.params;
        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: "Channel ID is required.",
            });
        }
        const subscription = await subscription_models_1.SubscriptionModel.findOne({
            userId: userId,
            channelId: channelId,
        });
        if (subscription) {
            return res.json({
                success: true,
                subscribed: true,
                message: "Đã đăng ký kênh  này",
            });
        }
        else {
            return res.json({
                success: true,
                subscribed: false,
                message: "Chưa đăng ký kênh này",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server lỗi",
        });
    }
};
exports.checkSubscription = checkSubscription;
const getSubscribedChannelVideos = async (req, res) => {
    try {
        const userId = req.userId;
        const subscriptions = await subscription_models_1.SubscriptionModel.find({ userId }).select("channelId");
        if (subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Chưa đăng ký bất kỳ kênh nào.",
            });
        }
        const subscribedChannelIds = subscriptions?.map((sub) => sub?.channelId);
        const videos = await video_models_1.VideoModel.find({
            writer: { $in: subscribedChannelIds },
            isPublic: true,
        })
            .select("title videoUrl videoThumbnail createdAt totalView writer")
            .populate("writer", "name avatar")
            .sort({ createdAt: -1 });
        return res.json({
            success: true,
            data: videos,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.getSubscribedChannelVideos = getSubscribedChannelVideos;
const getChannelSubscribersCount = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: "Channel ID is required.",
            });
        }
        const channelExists = await users_models_1.UserModel.exists({ _id: channelId });
        if (!channelExists) {
            return res.status(404).json({
                success: false,
                message: "Channel not found.",
            });
        }
        const subscriberCount = await subscription_models_1.SubscriptionModel.countDocuments({
            channelId,
        });
        return res.status(200).json({
            success: true,
            count: subscriberCount,
        });
    }
    catch (error) {
        console.error("Error in getChannelSubscribersCount:", error);
        return res.status(500).json({
            success: false,
            message: "Server lỗi",
        });
    }
};
exports.getChannelSubscribersCount = getChannelSubscribersCount;
