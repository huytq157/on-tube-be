"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoFavourite = exports.addVideoFavourite = exports.getVideoFavourite = void 0;
const video_models_1 = require("../models/video.models");
const favourite_models_1 = require("../models/favourite.models");
const getVideoFavourite = async (req, res) => {
    const userId = req.userId;
    try {
        const videoFavourites = await favourite_models_1.FavouriteModel.find({ userId }).sort("-createdAt");
        const videoIds = videoFavourites.map((favourite) => favourite.videoId);
        const videos = await video_models_1.VideoModel.find({ _id: { $in: videoIds } }).populate("writer");
        return res.json({
            success: true,
            videos,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.getVideoFavourite = getVideoFavourite;
const addVideoFavourite = async (req, res) => {
    const userId = req.userId;
    const videoId = req.body.videoId;
    try {
        const checkVideoExists = await favourite_models_1.FavouriteModel.find({ userId, videoId });
        if (checkVideoExists.length > 0) {
            return res.json({
                success: false,
                message: "Video already exists in favourites!",
            });
        }
        const newVideoFavourite = new favourite_models_1.FavouriteModel({
            videoId,
            userId,
        });
        await newVideoFavourite.save();
        const video = await video_models_1.VideoModel.findOne({
            _id: newVideoFavourite.videoId,
        }).populate("writer");
        return res.json({
            success: true,
            message: "Video added to favourites successfully!",
            video,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.addVideoFavourite = addVideoFavourite;
const deleteVideoFavourite = async (req, res) => {
    const userId = req.userId;
    const videoId = req.params.videoId;
    try {
        const deleteVideo = await favourite_models_1.FavouriteModel.findOneAndDelete({
            videoId,
            userId,
        });
        if (deleteVideo) {
            return res.json({
                success: true,
                message: "Video đã được xóa khỏi danh sách yêu thích",
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: "Video not found in favourites.",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.deleteVideoFavourite = deleteVideoFavourite;
