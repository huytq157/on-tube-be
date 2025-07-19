"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideobyCategory = exports.addedCategory = exports.getAllCategories = void 0;
const category_models_1 = require("../models/category.models");
const video_models_1 = require("../models/video.models");
const getAllCategories = async (req, res) => {
    try {
        const categories = await category_models_1.CategoryModel.find();
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: categories,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.getAllCategories = getAllCategories;
const addedCategory = async (req, res) => {
    try {
        const { title, slug } = req.body;
        if (!title) {
            return res.status(400).json({
                statusCode: 400,
                message: "Title is required",
            });
        }
        const newCategory = new category_models_1.CategoryModel({ title, slug });
        await newCategory.save();
        res.status(201).json({
            statusCode: 201,
            message: "Category created successfully",
            data: newCategory,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later.",
        });
    }
};
exports.addedCategory = addedCategory;
const getVideobyCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({
                statusCode: 400,
                message: "Category ID is required",
            });
        }
        const videos = await video_models_1.VideoModel.find({ category: categoryId })
            .populate("category")
            .populate("writer")
            .populate("tags");
        if (!videos.length) {
            return res.status(404).json({
                statusCode: 404,
                message: "No videos found for this category",
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
exports.getVideobyCategory = getVideobyCategory;
