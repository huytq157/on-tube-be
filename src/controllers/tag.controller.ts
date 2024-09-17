import express, { Request, Response } from "express";
import { TagModel } from "../models/tag.models";
import { VideoModel } from "../models/video.models";

const getAllTag = async (req: Request, res: Response) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json({
      statusCode: 200,
      message: "Success",
      data: tags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

const addTag = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        statusCode: 400,
        message: "Title is required",
      });
    }

    const newTag = new TagModel({ title });
    await newTag.save();

    res.status(201).json({
      statusCode: 201,
      message: "Tag created successfully",
      data: newTag,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

const getVideobyTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;

    if (!tagId) {
      return res.status(400).json({
        statusCode: 400,
        message: "tag ID is required",
      });
    }

    const videos = await VideoModel.find({ tags: tagId })
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

export { getAllTag, addTag, getVideobyTag };
