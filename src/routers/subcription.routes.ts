import express from "express";
const router = express.Router();

import {
  subscriptionChannel,
  getSubscribedChannels,
  unsubscribeChannel,
  checkSubscription,
  getSubscribedChannelVideos,
  getChannelSubscribersCount,
} from "../controllers/subcription.controller";
/**
 * @swagger
 * /api/subcription/sub:
 *   post:
 *     summary: Đăng ký (subscribe) một kênh
 *     tags: [Subcription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 description: ID của kênh muốn đăng ký
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thiếu channelId hoặc đã đăng ký rồi
 */
/**
 * @swagger
 * /api/subcription/un-sub:
 *   post:
 *     summary: Hủy đăng ký một kênh
 *     tags: [Subcription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 description: ID kênh muốn hủy đăng ký
 *     responses:
 *       200:
 *         description: Hủy đăng ký thành công
 *       404:
 *         description: Chưa đăng ký kênh này
 */
/**
 * @swagger
 * /api/subcription/subcriber:
 *   get:
 *     summary: Lấy danh sách kênh đã đăng ký của user
 *     tags: [Subcription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách kênh đã đăng ký
 */
/**
 * @swagger
 * /api/subcription/check-sub/{channelId}:
 *   get:
 *     summary: Kiểm tra user đã đăng ký kênh chưa
 *     tags: [Subcription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kênh cần kiểm tra
 *     responses:
 *       200:
 *         description: "Trạng thái đăng ký (subscribed: true/false)"
 */
/**
 * @swagger
 * /api/subcription/video-sub:
 *   get:
 *     summary: Lấy danh sách video từ các kênh đã đăng ký
 *     tags: [Subcription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: videoType
 *         schema:
 *           type: string
 *         required: false
 *         description: Lọc theo loại video (nếu có)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Số lượng mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách video từ các kênh đã đăng ký
 *       404:
 *         description: Chưa đăng ký bất kỳ kênh nào
 */
/**
 * @swagger
 * /api/subcription/channel/{channelId}/subcount:
 *   get:
 *     summary: Lấy số lượng subscriber của một kênh
 *     tags: [Subcription]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của kênh
 *     responses:
 *       200:
 *         description: Số lượng subscriber
 *       404:
 *         description: Kênh không tồn tại
 */
import { verifyToken } from "../middleware/verifyToken";
import { authenticateToken } from "../middleware/authToken";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/sub", authenticateToken, subscriptionChannel);
router.post("/un-sub", authenticateToken, unsubscribeChannel);
router.get("/subcriber", authenticateToken, getSubscribedChannels);
router.get("/check-sub/:channelId", authenticateToken, checkSubscription);
router.get("/video-sub", authenticateToken, getSubscribedChannelVideos);
router.get("/channel/:channelId/subcount", getChannelSubscribersCount);

router.use(limiter);
export default router;
