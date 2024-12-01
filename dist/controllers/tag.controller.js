"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideobyTag = exports.addTag = exports.getAllTag = void 0;
const tag_models_1 = require("../models/tag.models");
const video_models_1 = require("../models/video.models");
const getAllTag = async (req, res) => {
    try {
        const tags = await tag_models_1.TagModel.find();
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: tags,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.getAllTag = getAllTag;
const addTag = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({
                statusCode: 400,
                message: "Title is required",
            });
        }
        const newTag = new tag_models_1.TagModel({ title });
        await newTag.save();
        res.status(201).json({
            statusCode: 201,
            message: "Tag created successfully",
            data: newTag,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.addTag = addTag;
const getVideobyTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        if (!tagId) {
            return res.status(400).json({
                statusCode: 400,
                message: "tag ID is required",
            });
        }
        const videos = await video_models_1.VideoModel.find({ tags: tagId })
            .populate("category")
            .populate("writer")
            .populate("tags");
        if (!videos.length) {
            return res.status(404).json({
                statusCode: 404,
                message: "No videos found for this tag",
            });
        }
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: videos,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.getVideobyTag = getVideobyTag;
