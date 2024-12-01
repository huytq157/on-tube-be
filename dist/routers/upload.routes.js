"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const upload_controller_1 = require("../controllers/upload.controller");
router.post("/image", upload_controller_1.uploadImages);
router.get("/image/:fileName", upload_controller_1.getImage);
router.post("/video", upload_controller_1.uploadVideos);
router.get("/video/:fileName", upload_controller_1.getVideo);
router.post("/audio", upload_controller_1.uploadAudios);
router.get("/audio/:fileName", upload_controller_1.getAudio);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Upload
 */
/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                       size:
 *                         type: integer
 *                       url:
 *                         type: string
 *       500:
 *         description: Error occurred during image upload
 */
/**
 * @swagger
 * /api/upload/image/{fileName}:
 *   get:
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                     format:
 *                       type: string
 *                     width:
 *                       type: integer
 *                     height:
 *                       type: integer
 *                     bytes:
 *                       type: integer
 *                     url:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Error occurred while retrieving image details
 */
/**
 * @swagger
 * /api/upload/video:
 *   post:
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Videos uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                       size:
 *                         type: integer
 *                       url:
 *                         type: string
 *       500:
 *         description: Error occurred during video upload
 */
/**
 * @swagger
 * /api/upload/video/{fileName}:
 *   get:
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                     format:
 *                       type: string
 *                     duration:
 *                       type: number
 *                     width:
 *                       type: integer
 *                     height:
 *                       type: integer
 *                     bytes:
 *                       type: integer
 *                     url:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Error occurred while retrieving video details
 */
/**
 * @swagger
 * /api/upload/audio:
 *   post:
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audios:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Audios uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                       size:
 *                         type: integer
 *                       url:
 *                         type: string
 *       500:
 *         description: Error occurred during audio upload
 */
/**
 * @swagger
 * /api/upload/audio/{fileName}:
 *   get:
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audio details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                     format:
 *                       type: string
 *                     bytes:
 *                       type: integer
 *                     url:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Error occurred while retrieving audio details
 */
// http://localhost:8000/api/upload/details/image/ecomerce-bt%2Fcomputed-filename-using-request
// http://localhost:8000/api/details/video/ecomerce-bt%2Fvideos%2F1724497520907-video1
