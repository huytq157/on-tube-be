import express, { Request, Response } from "express";
import { CommentModel } from "../models/comment.models";
import mongoose, { Types } from "mongoose";
import { LikeModel } from "../models/like.models";
import { NotificationModel } from "../models/notification.models";

interface CustomRequest extends Request {
  userId?: string;
}

interface User {
  _id: Types.ObjectId;
  name: string;
  avatar: string;
}

interface Reply {
  _id: Types.ObjectId;
  comment: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  parent_id: Types.ObjectId | null;
  replies?: Reply[];
}

interface Comment {
  _id: Types.ObjectId;
  comment: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  replies?: Reply[];
  is_owner?: boolean;
}

export const createComment = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const { comment, video_id } = req.body;
  const userId = req.userId;

  if (!comment) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameter comment text" });
  }

  try {
    const newComment = new CommentModel({
      user: userId,
      parent_id: null,
      video: video_id,
      comment,
    });

    await newComment.save();

    return res.json({ success: true, comment: newComment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error occurred", error });
  }
};

export const updateComment = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const { comment } = req.body;
  const commentId = req.params.id;
  const userId = req.userId;

  if (!comment) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameter comment text" });
  }

  try {
    const existingComment = await CommentModel.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (existingComment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "User unauthorized to update this comment",
      });
    }
    existingComment.comment = comment;
    await existingComment.save();

    return res.json({
      success: true,
      message: "Comment updated successfully",
      comment: existingComment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error occurred", error });
  }
};

export const deleteComment = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const commentId = req.params.id;
  const userId = req.userId;

  try {
    const existingComment = await CommentModel.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (existingComment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "User unauthorized to delete this comment",
      });
    }

    await CommentModel.deleteOne({ _id: commentId });

    return res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error occurred", error });
  }
};

export const replyComment = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const { comment, parent_id } = req.body;
  const userId = req.userId;

  if (!comment || !parent_id) {
    return res.status(400).json({
      success: false,
      message: "Missing parameter comment text or parent comment ID",
    });
  }

  try {
    const parentComment = await CommentModel.findById(parent_id);
    if (!parentComment) {
      return res
        .status(404)
        .json({ success: false, message: "Parent comment not found" });
    }

    const newReply = new CommentModel({
      user: userId,
      parent_id: parent_id,
      video: parentComment.video,
      comment,
    });

    await newReply.save();

    return res.json({ success: true, reply: newReply });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error occurred", error });
  }
};

const getNestedReplies = async (parentId: Types.ObjectId): Promise<Reply[]> => {
  const replies = await CommentModel.aggregate([
    {
      $match: {
        parent_id: parentId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        comment: 1,
        user: {
          _id: "$user._id",
          name: "$user.name",
          avatar: "$user.avatar",
        },
        createdAt: 1,
        updatedAt: 1,
        parent_id: 1,
      },
    },
  ]);

  const nestedReplies: Reply[] = await Promise.all(
    replies.map(async (reply: Reply) => {
      const childReplies = await getNestedReplies(reply._id);
      return {
        ...reply,
        replies: childReplies,
      };
    })
  );

  return nestedReplies;
};

export const getComments = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const video_id = req.params.video_id;
  const userId = req.userId;
  const sortBy = req.query.sortBy || "newest";

  if (!video_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameter videoId" });
  }

  try {
    let sortCriteria = {};
    if (sortBy === "oldest") {
      sortCriteria = { createdAt: 1 };
    } else if (sortBy === "newest") {
      sortCriteria = { createdAt: -1 };
    } else if (sortBy === "mostLiked") {
      sortCriteria = { likeCount: -1 };
    }

    const comments = await CommentModel.aggregate([
      {
        $match: {
          parent_id: null,
          video: new mongoose.Types.ObjectId(video_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$_id",
          comment: 1,
          user: {
            _id: 1,
            name: 1,
            avatar: 1,
          },
          createdAt: 1,
          updatedAt: 1,
          likeCount: 1,
        },
      },
      { $sort: sortCriteria },
    ]);

    const commentsWithReplies: Comment[] = await Promise.all(
      comments.map(async (comment) => {
        const replies = await getNestedReplies(comment._id);
        return {
          ...comment,
          replies,
        };
      })
    );

    const totalComments = await CommentModel.countDocuments({
      video: new mongoose.Types.ObjectId(video_id),
    });

    return res.json({
      success: true,
      data: commentsWithReplies.map((item) => ({
        ...item,
        is_owner: userId
          ? item.user._id.toString() === userId.toString()
          : false,
      })),
      totalComments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error occurred", error });
  }
};
