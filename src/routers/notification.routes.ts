import express from "express";
import {
  createNotification,
  getNotification,
  updateStatusSeen,
} from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/authToken";
const router = express.Router();
/**
 * @swagger
 * /api/notification/create:
 *   post:
 *     summary: Tạo mới một thông báo
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 description: ID comment liên quan (nếu có)
 *               video:
 *                 type: string
 *                 nullable: true
 *                 description: ID video liên quan (nếu có)
 *               url:
 *                 type: string
 *                 description: Đường dẫn liên quan đến thông báo
 *               message:
 *                 type: string
 *                 description: Nội dung thông báo
 *               user:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách user nhận thông báo (nếu không truyền sẽ gửi đến tất cả subscriber)
 *     responses:
 *       200:
 *         description: Tạo thông báo thành công
 *       400:
 *         description: Thiếu tham số bắt buộc
 */
/**
 * @swagger
 * /api/notification/gets:
 *   get:
 *     summary: Lấy danh sách thông báo của user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Danh sách thông báo
 */
/**
 * @swagger
 * /api/notification/update-seen:
 *   put:
 *     summary: Đánh dấu thông báo đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: ID thông báo cần đánh dấu đã đọc
 *               user_id:
 *                 type: string
 *                 description: ID user nhận thông báo
 *     responses:
 *       200:
 *         description: Đánh dấu đã đọc thành công
 *       404:
 *         description: Không tìm thấy thông báo hoặc không có quyền
 */

router.post("/create", authenticateToken, createNotification);
router.get("/gets", authenticateToken, getNotification);
router.put("/update-seen", authenticateToken, updateStatusSeen);

export default router;

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing channels
 */
