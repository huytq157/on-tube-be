"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSeen = exports.getNotification = exports.createNotification = void 0;
const notification_models_1 = require("../models/notification.models");
const subscription_models_1 = require("../models/subscription.models");
const createNotification = async (req, res) => {
    const { comment, message, video, url, user } = req.body;
    const from_user = req.userId;
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
const getNotification = async (req, res) => {
    const user_id = req.userId;
    try {
        const notifications = await notification_models_1.NotificationModel.find({
            user: user_id,
        })
            .populate({
            path: "from_user",
            select: "_id name avatar",
        })
            .sort("-createdAt");
        res.json({ success: true, data: notifications });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server not found!", error });
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
