import express, { Request, Response } from "express";
import { NotificationModel } from "../models/notification.models";
import { SubscriptionModel } from "../models/subscription.models";

interface CustomRequest extends Request {
  userId?: string;
}

interface createNotificationFormValue {
  comment: string | null;
  video: string | null;
  url: string;
  message: string;
  user: string[];
}

export const createNotification = async (req: CustomRequest, res: Response) => {
  const { comment, message, video, url, user } =
    req.body as createNotificationFormValue;
  const from_user = req.userId;
  console.log("from_user: ", from_user);

  if (!message || !url) {
    return res
      .status(400)
      .json({ success: false, message: "Missing paramerter!" });
  }

  try {
    const subcribers =
      user?.length > 0
        ? user
        : (await SubscriptionModel.find({ channelId: from_user })).map(
            (item) => item.userId
          );

    const newNotify = new NotificationModel({
      from_user,
      user: subcribers,
      message,
      url,
      comment,
      video,
    });

    await newNotify.save();

    const notify = await NotificationModel.findOne({
      _id: newNotify._id,
    }).populate({
      path: "from_user",
      select: "_id name email avatar",
    });

    res.json({
      success: true,
      notification: notify,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server not found!", error });
  }
};

// export const getNotification = async (req: CustomRequest, res: Response) => {
//   const user_id = req.userId;

//   try {
//     const notifications = await NotificationModel.find({
//       user: user_id,
//     })
//       .populate({
//         path: "from_user",
//         select: "_id name avatar",
//       })
//       .sort("-createdAt");

//     res.json({ success: true, data: notifications });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server not found!", error });
//   }
// };

export const getNotification = async (req: CustomRequest, res: Response) => {
  const user_id = req.userId;
  const { page = 1, limit = 10 } = req.query;
  const perPage = parseInt(limit as string, 10) || 10;
  const currentPage = parseInt(page as string, 10) || 1;
  const skip = (currentPage - 1) * perPage;

  try {
    const totalCount = await NotificationModel.countDocuments({
      user: user_id,
    });

    const notifications = await NotificationModel.find({ user: user_id })
      .populate({
        path: "from_user",
        select: "_id name avatar",
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(perPage)
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
      data: notifications,
      headers,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
      error,
    });
  }
};

export const updateStatusSeen = async (req: Request, res: Response) => {
  const { notificationId, user_id } = req.body;

  if (!notificationId || !user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing notification ID or user ID" });
  }

  try {
    const result = await NotificationModel.updateOne(
      { _id: notificationId, user: user_id },
      { read: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or access denied",
      });
    }

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server not found!", error });
  }
};

// {
//     "comment": null,
//     "post": "6623ff1e0a5295dc12cac7c3",
//     "message": "vừa thích bài viết của bạn",
//     "url": "/post/6623ff1e0a5295dc12cac7c3",
//     "user": [
//         "65a4c290cca2c50dbd703083" // nếu ko có user thì danh sách nhận thông báo là người đã đăng ký
//     ]
// }

// user là người nhận
// from_user là người gửi thông báo
