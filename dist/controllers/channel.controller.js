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
    const videoType = req.query.videoType;
    const sortBy = req.query.sortBy;
    try {
        const filter = {
            writer: channelId,
            isPublic: isPublic,
        };
        if (videoType) {
            filter.videoType = videoType;
        }
        const totalCount = await video_models_1.VideoModel.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);
        const hasMore = page < totalPages;
        let sortOptions = { createdAt: -1 };
        if (sortBy === "oldest") {
            sortOptions = { createdAt: 1 };
        }
        const videos = await video_models_1.VideoModel.find(filter)
            .select("title videoThumbnail videoUrl isPublic publishedDate totalView createdAt videoType likeCount dislikeCount allowComments")
            .skip(skip)
            .limit(limit)
            .populate("writer")
            .sort(sortOptions);
        const headers = {
            "x-page": page,
            "x-total-count": totalCount,
            "x-pages-count": totalPages,
            "x-per-page": limit,
            "x-next-page": hasMore ? page + 1 : null,
        };
        return res.status(200).json({
            success: true,
            data: videos,
            headers,
            hasMore,
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
    const { page = 1, limit = 12, isPublic = "true" } = req.query;
    const perPage = parseInt(limit, 10) || 12;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * perPage;
    const publicFlag = isPublic === "true";
    try {
        const totalCount = await playlist_models_1.PlaylistModel.countDocuments({
            writer: channelId,
            isPublic: publicFlag,
        });
        const playlists = await playlist_models_1.PlaylistModel.find({
            writer: channelId,
            isPublic: publicFlag,
        })
            .skip(skip)
            .limit(perPage)
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
            .sort("-createdAt")
            .lean();
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
            playlists,
            headers,
            hasMore,
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
