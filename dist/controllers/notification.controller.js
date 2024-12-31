"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSeen = exports.getNotification = exports.createNotification = void 0;
const notification_models_1 = require("../models/notification.models");
const subscription_models_1 = require("../models/subscription.models");
const createNotification = async (req, res) => {
    const { comment, message, video, url, user } = req.body;
    const from_user = req.userId;
    console.log("from_user: ", from_user);
    if (!message || !url) {
        return res
            .status(400)
            .json({ success: false, message: "Missing paramerter!" });
    }
    try {
        const subcribers = user?.length > 0
            ? user
            : (await subscription_models_1.SubscriptionModel.find({ channelId: from_user })).map((item) => item.userId);
        const newNotify = new notification_models_1.NotificationModel({
            from_user,
            user: subcribers,
            message,
            url,
            comment,
            video,
        });
        await newNotify.save();
        const notify = await notification_models_1.NotificationModel.findOne({
            _id: newNotify._id,
        }).populate({
            path: "from_user",
            select: "_id name email avatar",
        });
        res.json({
            success: true,
            notification: notify,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server not found!", error });
    }
};
exports.createNotification = createNotification;
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
const getNotification = async (req, res) => {
    const user_id = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const perPage = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * perPage;
    try {
        const totalCount = await notification_models_1.NotificationModel.countDocuments({
            user: user_id,
        });
        const notifications = await notification_models_1.NotificationModel.find({ user: user_id })
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
            error,
        });
    }
};
exports.getNotification = getNotification;
const updateStatusSeen = async (req, res) => {
    const { notificationId, user_id } = req.body;
    if (!notificationId || !user_id) {
        return res
            .status(400)
            .json({ success: false, message: "Missing notification ID or user ID" });
    }
    try {
        const result = await notification_models_1.NotificationModel.updateOne({ _id: notificationId, user: user_id }, { read: true });
        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or access denied",
            });
        }
        res.json({ success: true, message: "Notification marked as read" });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server not found!", error });
    }
};
exports.updateStatusSeen = updateStatusSeen;
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
