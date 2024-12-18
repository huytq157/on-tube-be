"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserVideoCount = exports.getVideoRecommend = exports.getVideobyId = exports.getWatchedVideos = exports.descViewAuth = exports.descView = exports.deleteVideo = exports.getTrendingVideos = exports.searchVideo = exports.updateVideo = exports.addVideo = exports.getVideos = exports.getAllVideos = void 0;
const video_models_1 = require("../models/video.models");
const category_models_1 = require("../models/category.models");
const playlist_models_1 = require("../models/playlist.models");
const mongoose_1 = __importDefault(require("mongoose"));
const watchvideo_models_1 = require("../models/watchvideo.models");
const getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const isPublic = req.query.isPublic === "true";
        const videoType = req.query.videoType;
        const filter = {};
        if (category) {
            if (mongoose_1.default.Types.ObjectId.isValid(category)) {
                filter.category = category;
            }
        }
        if (req.query.isPublic) {
            filter.isPublic = isPublic;
        }
        if (videoType && ["short", "long"].includes(videoType)) {
            filter.videoType = videoType;
        }
        const total = await video_models_1.VideoModel.countDocuments(filter);
        const videos = await video_models_1.VideoModel.find(filter)
            .select("title videoThumbnail videoUrl isPublic publishedDate totalView videoType createdAt")
            .limit(limit)
            .skip(skip)
            .populate("writer", "name avatar")
            .sort("-createdAt")
            .lean();
        return res.status(200).json({
            success: true,
            data: videos,
            totalPage: Math.ceil(total / limit),
            currentPage: page,
            total,
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
exports.getAllVideos = getAllVideos;
const getVideos = async (req, res) => {
    try {
        const { page = 1, limit = 5, lastCreatedAt } = req.query;
        const perPage = parseInt(limit) || 5;
        const currentPage = parseInt(page) || 1;
        let query = {};
        if (lastCreatedAt) {
            query = { createdAt: { $lt: lastCreatedAt } };
        }
        const videos = await video_models_1.VideoModel.find(query)
            .select("title videoThumbnail videoUrl isPublic publishedDate totalView  createdAt")
            .populate("writer", "name avatar")
            .sort({ createdAt: -1 })
            .limit(perPage);
        const totalCount = await video_models_1.VideoModel.countDocuments({});
        const totalPages = Math.ceil(totalCount / perPage);
        const headers = {
            "x-page": currentPage,
            "x-total-count": totalCount,
            "x-pages-count": totalPages,
            "x-per-page": perPage,
            "x-next-page": currentPage < totalPages ? currentPage + 1 : null,
        };
        return res.status(200).json({
            success: true,
            data: videos,
            headers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getVideos = getVideos;
const addVideo = async (req, res) => {
    if (!req.body.videoUrl.includes("")) {
        return res.status(400).json({
            success: false,
            message: "You do not have permission to upload videos!",
        });
    }
    try {
        const { title, description, videoUrl, isPublic, allowComments, category, playlist, tags, videoThumbnail, publishedDate, videoType, } = req.body;
        if (!title || !description || !videoUrl || !publishedDate || !videoType) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided!",
            });
        }
        if (!videoUrl.includes("http")) {
            return res.status(400).json({
                success: false,
                message: "Invalid video URL!",
            });
        }
        let validCategory = null;
        if (category &&
            category.trim() !== "" &&
            mongoose_1.default.Types.ObjectId.isValid(category)) {
            const categoryExists = await category_models_1.CategoryModel.findById(category);
            if (categoryExists) {
                validCategory = category;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Category does not exist!",
                });
            }
        }
        let validPlaylist = null;
        if (playlist &&
            playlist.trim() !== "" &&
            mongoose_1.default.Types.ObjectId.isValid(playlist)) {
            const playlistExists = await playlist_models_1.PlaylistModel.findById(playlist);
            if (playlistExists) {
                validPlaylist = playlist;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Playlist does not exist!",
                });
            }
        }
        const writer = req.userId;
        const newVideo = new video_models_1.VideoModel({
            title,
            description,
            videoUrl,
            isPublic,
            allowComments,
            category: validCategory,
            playlist: validPlaylist,
            tags,
            videoThumbnail,
            publishedDate,
            writer,
            videoType,
        });
        await newVideo.save();
        if (validPlaylist) {
            await playlist_models_1.PlaylistModel.findByIdAndUpdate(validPlaylist, { $push: { videos: newVideo._id } }, { new: true });
        }
        return res.status(201).json({
            success: true,
            message: "Video uploaded successfully!",
            data: newVideo,
        });
    }
    catch (error) {
        console.error("Error adding video:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.addVideo = addVideo;
const updateVideo = async (req, res) => {
    const videoId = req.params.id;
    const userId = req.userId;
    try {
        const { title, description, videoUrl, isPublic, allowComments, category, playlist, tags, videoThumbnail, publishedDate, videoType, } = req.body;
        // Kiểm tra video có tồn tại và thuộc về người dùng hiện tại hay không
        const video = await video_models_1.VideoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found!",
            });
        }
        if (video.writer.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this video!",
            });
        }
        // Kiểm tra URL video có hợp lệ không
        if (videoUrl && !videoUrl.includes("http")) {
            return res.status(400).json({
                success: false,
                message: "Invalid video URL!",
            });
        }
        // Kiểm tra category có tồn tại không
        let validCategory = video.category;
        if (category && mongoose_1.default.Types.ObjectId.isValid(category)) {
            const categoryExists = await category_models_1.CategoryModel.findById(category);
            if (categoryExists) {
                validCategory = category;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Category does not exist!",
                });
            }
        }
        // Kiểm tra playlist có tồn tại không
        let validPlaylist = video.playlist;
        if (playlist && mongoose_1.default.Types.ObjectId.isValid(playlist)) {
            const playlistExists = await playlist_models_1.PlaylistModel.findById(playlist);
            if (playlistExists) {
                validPlaylist = playlist;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Playlist does not exist!",
                });
            }
        }
        // Cập nhật video
        const updatedVideo = await video_models_1.VideoModel.findByIdAndUpdate(videoId, {
            title: title || video.title,
            description: description || video.description,
            videoUrl: videoUrl || video.videoUrl,
            isPublic: typeof isPublic === "boolean" ? isPublic : video.isPublic,
            allowComments: typeof allowComments === "boolean"
                ? allowComments
                : video.allowComments,
            category: validCategory,
            playlist: validPlaylist,
            tags: tags || video.tags,
            videoThumbnail: videoThumbnail || video.videoThumbnail,
            publishedDate: publishedDate || video.publishedDate,
            videoType: videoType || video.videoType,
        }, { new: true });
        // Nếu playlist có thay đổi, cập nhật playlist
        if (video.playlist !== validPlaylist) {
            // Nếu video trước đó có playlist, xóa video khỏi playlist đó
            if (video.playlist) {
                await playlist_models_1.PlaylistModel.findByIdAndUpdate(video.playlist, { $pull: { videos: videoId } }, { new: true });
            }
            // Nếu validPlaylist không null, thêm video vào playlist mới
            if (validPlaylist) {
                await playlist_models_1.PlaylistModel.findByIdAndUpdate(validPlaylist, { $addToSet: { videos: videoId } }, { new: true });
            }
        }
        return res.status(200).json({
            success: true,
            message: "Video updated successfully!",
            data: updatedVideo,
        });
    }
    catch (error) {
        console.error("Error updating video:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.updateVideo = updateVideo;
const searchVideo = async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm || !searchTerm.trim()) {
        return res.status(400).json({
            success: false,
            message: "Missing parameters!",
        });
    }
    try {
        const textReg = new RegExp(searchTerm.trim(), "i");
        const results = await video_models_1.VideoModel.find({
            title: textReg,
        })
            .populate("writer", "name email avatar")
            .sort("-totalView")
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
            message: "An error occurred while searching for videos.",
        });
    }
};
exports.searchVideo = searchVideo;
const getTrendingVideos = async (req, res) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const videoType = req.query.videoType;
    const skip = (page - 1) * limit;
    try {
        const matchConditions = { isPublic: true };
        if (videoType) {
            matchConditions.videoType = videoType;
        }
        const trendingVideos = await video_models_1.VideoModel.aggregate([
            {
                $match: matchConditions,
            },
            {
                $addFields: {
                    trendScore: {
                        $add: [
                            { $multiply: ["$totalView", 1] },
                            { $multiply: ["$likeCount", 2] },
                            {
                                $cond: [
                                    {
                                        $gte: [
                                            "$publishedDate",
                                            new Date(new Date().setDate(new Date().getDate() - 7)),
                                        ],
                                    },
                                    10,
                                    0,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $sort: { trendScore: -1, publishedDate: -1 },
            },
            {
                $limit: limit,
            },
            {
                $skip: skip,
            },
            {
                $project: {
                    title: 1,
                    videoThumbnail: 1,
                    videoUrl: 1,
                    isPublic: 1,
                    publishedDate: 1,
                    totalView: 1,
                    createdAt: 1,
                    writer: 1,
                    category: 1,
                },
            },
        ]);
        const videosWithDetails = await video_models_1.VideoModel.populate(trendingVideos, [
            { path: "writer", select: "name avatar" },
            { path: "category", select: "title" },
        ]);
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: videosWithDetails,
        });
    }
    catch (error) {
        console.error("Error in getting trending videos:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Server Error",
        });
    }
};
exports.getTrendingVideos = getTrendingVideos;
const deleteVideo = async (req, res) => {
    const _id = req.params.id;
    const userId = req.userId;
    try {
        const videoToDelete = await video_models_1.VideoModel.findOne({ _id });
        if (!videoToDelete) {
            return res.status(404).json({
                success: false,
                message: "Video not found!",
            });
        }
        if (videoToDelete.writer.toString() === userId) {
            const deletedVideo = await video_models_1.VideoModel.findOneAndDelete({ _id });
            if (deletedVideo) {
                return res.json({
                    success: true,
                    message: "Delete success!",
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete the video!",
                });
            }
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xóa video này!",
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
exports.deleteVideo = deleteVideo;
const descView = async (req, res) => {
    try {
        const { id } = req.params;
        const { watchTime } = req.body;
        if (watchTime >= 1) {
            const updatedVideo = await video_models_1.VideoModel.findByIdAndUpdate(id, { $inc: { totalView: 1 } }, { new: true });
            if (!updatedVideo) {
                return res.status(404).json({ message: "Video not found" });
            }
            return res
                .status(200)
                .json({ message: "View added", video: updatedVideo });
        }
        else {
            return res
                .status(400)
                .json({ message: "Watch time must be at least 60 seconds" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};
exports.descView = descView;
const descViewAuth = async (req, res) => {
    try {
        const { id } = req.params;
        const { watchTime } = req.body;
        const userId = req.userId;
        if (watchTime >= 1) {
            const updatedVideo = await video_models_1.VideoModel.findByIdAndUpdate(id, { $inc: { totalView: 1 } }, { new: true });
            if (!updatedVideo) {
                return res.status(404).json({ message: "Video not found" });
            }
            if (userId) {
                const watchedVideoExists = await watchvideo_models_1.WatchedVideoModel.findOne({
                    user: userId,
                    video: id,
                });
                if (!watchedVideoExists) {
                    await watchvideo_models_1.WatchedVideoModel.create({
                        user: userId,
                        video: id,
                        watchTime,
                    });
                }
                else {
                    watchedVideoExists.watchTime = watchTime;
                    await watchedVideoExists.save();
                }
            }
            return res.status(200).json({
                message: "View added and watch history updated",
                video: updatedVideo,
            });
        }
        else {
            return res.status(400).json({
                message: "Watch time must be at least 60 seconds",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error,
        });
    }
};
exports.descViewAuth = descViewAuth;
const getWatchedVideos = async (req, res) => {
    const userId = req.params.userId;
    try {
        const twoWeeksAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        await watchvideo_models_1.WatchedVideoModel.deleteMany({
            user: userId,
            watchedAt: { $lt: twoWeeksAgo },
        });
        const watchedVideos = await watchvideo_models_1.WatchedVideoModel.find({ user: userId })
            .populate({
            path: "video",
            select: "videoUrl createdAt videoThumbnail isPublic title",
            populate: {
                path: "writer",
                select: "avatar name",
            },
        })
            .exec();
        if (!watchedVideos) {
            return res.status(404).json({ message: "No watched videos found." });
        }
        res.status(200).json({
            success: true,
            data: watchedVideos,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getWatchedVideos = getWatchedVideos;
const getVideobyId = async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid video ID",
        });
    }
    try {
        const video = await video_models_1.VideoModel.findById(id)
            .populate("writer", "name avatar")
            .populate("tags", "name")
            .lean();
        console.log("video:", video);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found!",
            });
        }
        return res.status(200).json({
            success: true,
            data: video,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.getVideobyId = getVideobyId;
const getVideoRecommend = async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid video ID",
        });
    }
    try {
        const currentVideo = await video_models_1.VideoModel.findById(id).lean();
        if (!currentVideo) {
            return res.status(404).json({
                success: false,
                message: "Video not found!",
            });
        }
        let recommendedVideos = await video_models_1.VideoModel.find({
            _id: { $ne: id },
            $or: [
                { category: currentVideo.category },
                { tags: { $in: currentVideo.tags } },
            ],
            isPublic: true,
        })
            .sort({ totalView: -1 })
            .limit(10)
            .populate("writer", "name avatar")
            .populate("tags", "name")
            .lean();
        if (recommendedVideos.length === 0) {
            recommendedVideos = await video_models_1.VideoModel.find({
                _id: { $ne: id },
                isPublic: true,
            })
                .sort({ totalView: -1, publishedDate: -1 })
                .limit(10)
                .populate("writer", "name avatar")
                .populate("tags", "name")
                .lean();
        }
        return res.status(200).json({
            success: true,
            data: recommendedVideos,
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
exports.getVideoRecommend = getVideoRecommend;
const getUserVideoCount = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing user ID!",
            });
        }
        const videoCount = await video_models_1.VideoModel.countDocuments({ writer: userId });
        return res.status(200).json({
            success: true,
            videoCount,
        });
    }
    catch (error) {
        console.error("Error fetching user video count:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.getUserVideoCount = getUserVideoCount;
