import express from "express";
import {
  likeVideo,
  dislikeVideo,
  checkIsLiked,
  getLikedVideos,
  checkIsDisliked,
  likeComment,
  disLikeComment,
  checkIsLikedComment,
} from "../controllers/like.controller";
/**
 * @swagger
 * /api/like/like:
 *   post:
 *     summary: Like hoặc bỏ like một video
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID video cần like
 *     responses:
 *       200:
 *         description: Like thành công hoặc bỏ like thành công
 *       400:
 *         description: Thiếu videoId hoặc userId
 */
/**
 * @swagger
 * /api/like/video-like:
 *   get:
 *     summary: Lấy danh sách video đã like của user
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách video đã like
 */
/**
 * @swagger
 * /api/like/dislike:
 *   post:
 *     summary: Dislike hoặc bỏ dislike một video
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID video cần dislike
 *     responses:
 *       200:
 *         description: Dislike thành công hoặc bỏ dislike thành công
 *       400:
 *         description: Thiếu videoId hoặc userId
 */
/**
 * @swagger
 * /api/like/check-like/{id}:
 *   get:
 *     summary: Kiểm tra user đã like video chưa
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID video
 *     responses:
 *       200:
 *         description: Trạng thái like
 */
/**
 * @swagger
 * /api/like/check-dislike/{id}:
 *   get:
 *     summary: Kiểm tra user đã dislike video chưa
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID video
 *     responses:
 *       200:
 *         description: Trạng thái dislike
 */
/**
 * @swagger
 * /api/like/like-comment:
 *   post:
 *     summary: Like hoặc bỏ like một comment
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID comment cần like
 *     responses:
 *       200:
 *         description: Like thành công hoặc bỏ like thành công
 *       400:
 *         description: Thiếu commentId hoặc userId
 */
/**
 * @swagger
 * /api/like/dislike-comment:
 *   post:
 *     summary: Dislike hoặc bỏ dislike một comment
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID comment cần dislike
 *     responses:
 *       200:
 *         description: Dislike thành công hoặc bỏ dislike thành công
 *       400:
 *         description: Thiếu commentId hoặc userId
 */
/**
 * @swagger
 * /api/like/check-like-comment:
 *   post:
 *     summary: Kiểm tra trạng thái like/dislike của comment
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID comment cần kiểm tra
 *     responses:
 *       200:
 *         description: Trạng thái like/dislike của comment
 */
import rateLimit from "express-rate-limit";
import { authenticateToken } from "../middleware/authToken";
const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/like", authenticateToken, likeVideo);
router.get("/video-like", authenticateToken, getLikedVideos);
router.post("/dislike", authenticateToken, dislikeVideo);
router.get("/check-like/:id", authenticateToken, checkIsLiked);
router.get("/check-dislike/:id", authenticateToken, checkIsDisliked);
router.post("/like-comment", authenticateToken, likeComment);
router.post("/dislike-comment", authenticateToken, disLikeComment);
router.post("/check-like-comment", authenticateToken, checkIsLikedComment);

router.use(limiter);
export default router;
