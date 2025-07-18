import express, { Request, Response } from "express";
import { CategoryModel } from "../models/category.models";
import { VideoModel } from "../models/video.models";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({
      statusCode: 200,
      message: "Success",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

const addedCategory = async (req: Request, res: Response) => {
  try {
    const { title, slug } = req.body;

    if (!title) {
      return res.status(400).json({
        statusCode: 400,
        message: "Title is required",
      });
    }

    const newCategory = new CategoryModel({ title, slug });
    await newCategory.save();

    res.status(201).json({
      statusCode: 201,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

const getVideobyCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Category ID is required",
      });
    }

    const videos = await VideoModel.find({ category: categoryId })
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

export { getAllCategories, addedCategory, getVideobyCategory };
