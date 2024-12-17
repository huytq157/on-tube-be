"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChannel = exports.searchChannel = exports.getChannelPlaylist = exports.getChannelVideo = exports.getChannelInfo = void 0;
const users_models_1 = require("../models/users.models");
const video_models_1 = require("../models/video.models");
const playlist_models_1 = require("../models/playlist.models");
const getChannelInfo = async (req, res) => {
    const channelId = req.params.id;
    try {
        const channel = await users_models_1.UserModel.findOne({ _id: channelId }).select("-password");
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.getChannelInfo = getChannelInfo;
const getChannelVideo = async (req, res) => {
    const channelId = req.params.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;
    const isPublic = req.query.isPublic === "true";
    try {
        const total = await video_models_1.VideoModel.countDocuments({
            writer: channelId,
            isPublic: isPublic,
        });
        const videos = await video_models_1.VideoModel.find({
            writer: channelId,
            isPublic: isPublic,
        })
            .select("title videoThumbnail videoUrl isPublic publishedDate totalView createdAt videoType likeCount dislikeCount allowComments")
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.getChannelVideo = getChannelVideo;
const getChannelPlaylist = async (req, res) => {
    const channelId = req.params.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;
    const isPublic = req.query.isPublic === "true";
    try {
        const total = await playlist_models_1.PlaylistModel.countDocuments({
            writer: channelId,
            isPublic: isPublic,
        });
        const playlists = await playlist_models_1.PlaylistModel.find({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.getChannelPlaylist = getChannelPlaylist;
const searchChannel = async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm || !searchTerm.trim()) {
        return res.status(400).json({
            success: false,
            message: "Missing parameters!",
        });
    }
    try {
        const textReg = new RegExp(searchTerm.trim(), "i");
        const results = await users_models_1.UserModel.find({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching for channels.",
        });
    }
};
exports.searchChannel = searchChannel;
const updateChannel = async (req, res) => {
    const channelId = req.params.id;
    const { name, avatar, background, description } = req.body;
    try {
        const channel = await users_models_1.UserModel.findById(channelId);
        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found!",
            });
        }
        if (name)
            channel.name = name;
        if (avatar)
            channel.avatar = avatar;
        if (background)
            channel.background = background;
        if (description)
            channel.description = description;
        await channel.save();
        return res.json({
            success: true,
            channel,
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
exports.updateChannel = updateChannel;
