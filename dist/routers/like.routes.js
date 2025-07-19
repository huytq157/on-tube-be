"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const like_controller_1 = require("../controllers/like.controller");
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
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authToken_1 = require("../middleware/authToken");
const router = express_1.default.Router();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
router.post("/like", authToken_1.authenticateToken, like_controller_1.likeVideo);
router.get("/video-like", authToken_1.authenticateToken, like_controller_1.getLikedVideos);
router.post("/dislike", authToken_1.authenticateToken, like_controller_1.dislikeVideo);
router.get("/check-like/:id", authToken_1.authenticateToken, like_controller_1.checkIsLiked);
router.get("/check-dislike/:id", authToken_1.authenticateToken, like_controller_1.checkIsDisliked);
router.post("/like-comment", authToken_1.authenticateToken, like_controller_1.likeComment);
router.post("/dislike-comment", authToken_1.authenticateToken, like_controller_1.disLikeComment);
router.post("/check-like-comment", authToken_1.authenticateToken, like_controller_1.checkIsLikedComment);
router.use(limiter);
exports.default = router;
