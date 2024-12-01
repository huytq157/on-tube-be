"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikedVideos = exports.checkIsDisliked = exports.checkIsLiked = exports.dislikeVideo = exports.likeVideo = void 0;
const video_models_1 = require("../models/video.models");
const like_models_1 = require("../models/like.models");
const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.body;
        const userId = req.userId;
        if (!videoId || !userId) {
            return res
                .status(400)
                .json({ message: "Video ID and User ID are required." });
        }
        const video = await video_models_1.VideoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }
        const existingLike = await like_models_1.LikeModel.findOne({
            user: userId,
            video: videoId,
        });
        if (existingLike) {
            if (existingLike.type === "like") {
                await like_models_1.LikeModel.deleteOne({ _id: existingLike._id });
                video.likeCount -= 1;
            }
            else {
                existingLike.type = "like";
                await existingLike.save();
                video.likeCount += 1;
                video.dislikeCount -= 1;
            }
        }
        else {
            await new like_models_1.LikeModel({
                user: userId,
                video: videoId,
                type: "like",
            }).save();
            video.likeCount += 1;
        }
        await video.save();
        return res.status(200).json({
            message: "Video liked successfully.",
            likeCount: video.likeCount,
            dislikeCount: video.dislikeCount,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while liking the video." });
    }
};
exports.likeVideo = likeVideo;
const dislikeVideo = async (req, res) => {
    try {
        const { videoId } = req.body;
        const userId = req.userId;
        if (!videoId || !userId) {
            return res
                .status(400)
                .json({ message: "Video ID and User ID are required." });
        }
        const video = await video_models_1.VideoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }
        const existingLike = await like_models_1.LikeModel.findOne({
            user: userId,
            video: videoId,
        });
        if (existingLike) {
            if (existingLike.type === "dislike") {
                await like_models_1.LikeModel.deleteOne({ _id: existingLike._id });
                video.dislikeCount -= 1;
            }
            else {
                existingLike.type = "dislike";
                await existingLike.save();
                video.likeCount -= 1;
                video.dislikeCount += 1;
            }
        }
        else {
            await new like_models_1.LikeModel({
                user: userId,
                video: videoId,
                type: "dislike",
            }).save();
            video.dislikeCount += 1;
        }
        await video.save();
        return res.status(200).json({
            message: "Video disliked successfully.",
            likeCount: video.likeCount,
            dislikeCount: video.dislikeCount,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while disliking the video." });
    }
};
exports.dislikeVideo = dislikeVideo;
const checkIsLiked = async (req, res) => {
    const { id: videoId } = req.params;
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User not authenticated",
        });
    }
    try {
        const existingLike = await like_models_1.LikeModel.findOne({
            user: userId,
            video: videoId,
        });
        const isLiked = existingLike ? existingLike.type === "like" : false;
        return res.status(200).json({
            success: true,
            isLiked,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.checkIsLiked = checkIsLiked;
const checkIsDisliked = async (req, res) => {
    const { id: videoId } = req.params;
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User not authenticated",
        });
    }
    try {
        const existingLike = await like_models_1.LikeModel.findOne({
            user: userId,
            video: videoId,
        });
        const isDisliked = existingLike ? existingLike.type === "dislike" : false;
        return res.status(200).json({
            success: true,
            isDisliked,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.checkIsDisliked = checkIsDisliked;
const getLikedVideos = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User not authenticated",
        });
    }
    try {
        const likedVideos = await like_models_1.LikeModel.find({ user: userId, type: "like" })
            .populate({
            path: "video",
            populate: {
                path: "writer",
                select: "name avatar",
            },
        })
            .exec();
        const videos = likedVideos
            .filter((like) => like.video)
            .map((like) => like.video);
        return res.status(200).json({
            success: true,
            data: videos,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.getLikedVideos = getLikedVideos;
