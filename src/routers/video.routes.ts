import express from "express";
const router = express.Router();

import {
  getAllVideos,
  searchVideo,
  getTrendingVideos,
  deleteVideo,
  addVideo,
} from "../controllers/video.controller";
import { verifyToken } from "../middleware/verifyToken";
import {
  getVideoFavourite,
  addVideoFavourite,
  deleteVideoFavourite,
} from "../controllers/favourite.controller";

router.get("/list", getAllVideos);
router.get("/search", searchVideo);
router.get("/trending", getTrendingVideos);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/favourite", verifyToken, getVideoFavourite);
router.post("/favourite", verifyToken, addVideoFavourite);
router.delete("/:videoId", verifyToken, deleteVideoFavourite);
router.post("/add", verifyToken, addVideo);

export default router;

/**
 * @swagger
 * /api/video/like:
 *   post:
 *     tags: [Videos]
 *     summary: Like or Dislike video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID of the video to like or dislike
 *                 example: "60c72b2f5f1b2c001f3b2e4e"
 *               type:
 *                 type: string
 *                 description: Type of action, either 'LIKE' or 'DISLIKE'
 *                 enum:
 *                   - LIKE
 *                   - DISLIKE
 *                 example: "LIKE"
 *             required:
 *               - videoId
 *               - type
 *     responses:
 *       200:
 *         description: Successfully updated the like or dislike status of the video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: Bad request if the videoId or type is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *     security:
 *       - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/video/search:
 *   get:
 *     tags: [Videos]
 *     summary: Tìm kiếm video
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Tìm kiếm theo title
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of videos matching the search term.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the video.
 *                       title:
 *                         type: string
 *                         description: The title of the video.
 *                       description:
 *                         type: string
 *                         description: The description of the video.
 *                       videoUrl:
 *                         type: string
 *                         description: The URL of the video.
 *                       isPublic:
 *                         type: boolean
 *                         description: Indicates whether the video is public.
 *                       writer:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The unique identifier for the writer (user).
 *                           name:
 *                             type: string
 *                             description: The name of the writer.
 *                       videoThumbnail:
 *                         type: string
 *                         description: The thumbnail image URL for the video.
 *                       totalView:
 *                         type: number
 *                         description: The total number of views the video has.
 *       400:
 *         description: Bad request if the search term is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing parameters!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while searching for videos.
 *     security:
 *       - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Videos
 */

/**
 * @swagger
 * /api/video/list:
 *   get:
 *     tags: [Videos]
 *     summary: Lấy tất cả video
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *                 totalPage:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/video/trending:
 *   get:
 *     summary: Danh sách video thịnh hành
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: A list of trending videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f7c3a2d0a4b9c1a1fba92e"
 *                       title:
 *                         type: string
 *                         example: "Top 10 Coding Tips"
 *                       description:
 *                         type: string
 *                         example: "Learn the top 10 coding tips that will boost your productivity."
 *                       videoUrl:
 *                         type: string
 *                         example: "http://example.com/videos/123"
 *                       isPublic:
 *                         type: boolean
 *                         example: true
 *                       writer:
 *                         type: string
 *                         example: "64f7c2b3a0b5c8c9a8d1e4b5"
 *                       category:
 *                         type: string
 *                         example: "64f7c2c4a0d5d9b9e8f1c2a3"
 *                       playlist:
 *                         type: string
 *                         example: "64f7c2d5b0e6e7c8f9a0b1c2"
 *                       videoThumnail:
 *                         type: string
 *                         example: "http://example.com/thumbnails/123.jpg"
 *                       totalView:
 *                         type: number
 *                         example: 1024
 *                       createdAt:
 *                         type: string
 *                         example: "2023-08-29T12:34:56.789Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2023-08-29T12:34:56.789Z"
 *       404:
 *         description: No trending videos found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No trending videos found!"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error!"
 */

/**
 * @swagger
 * /api/video/{id}:
 *   delete:
 *     summary: Xóa video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Delete success!"
 *       400:
 *         description: User is not authorized to delete the video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to delete this video!"
 *       404:
 *         description: Video not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Video not found!"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error!"
 */

/**
 * @swagger
 * /api/video/favourite:
 *   get:
 *     summary: Danh sách video yêu thích
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of favourite videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f7c3a2d0a4b9c1a1fba92e"
 *                       title:
 *                         type: string
 *                         example: "How to Learn TypeScript"
 *                       description:
 *                         type: string
 *                         example: "A comprehensive guide on learning TypeScript."
 *                       videoUrl:
 *                         type: string
 *                         example: "https://example.com/videos/typescript-tutorial.mp4"
 *                       writer:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f7c3a2d0a4b9c1a1fba92e"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                       isPublic:
 *                         type: boolean
 *                         example: true
 *                       totalView:
 *                         type: number
 *                         example: 1024
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-08-29T12:34:56Z"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error!"
 */

/**
 * @swagger
 * /api/video/favourite:
 *   post:
 *     summary: Thêm video vào danh sách yêu thích
 *     tags: [Videos]
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
 *                 description: ID of the video to be added to favourites.
 *                 example: "605c72ef9b1e8b001f9f0e8d"
 *     responses:
 *       200:
 *         description: Video successfully added to favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Video added to favourites successfully!"
 *                 video:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the video
 *                       example: "605c72ef9b1e8b001f9f0e8d"
 *                     title:
 *                       type: string
 *                       description: Title of the video
 *                       example: "Introduction to TypeScript"
 *                     writer:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: ID of the writer
 *                           example: "605c72ef9b1e8b001f9f0e8c"
 *                         name:
 *                           type: string
 *                           description: Name of the writer
 *                           example: "John Doe"
 *       400:
 *         description: Bad request, e.g., missing videoId or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error!"
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * /api/video/{videoId}:
 *   delete:
 *     summary: Xóa video khỏi danh sách yêu thích
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video successfully removed from favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Video removed from favourites successfully!"
 *       404:
 *         description: Video not found in favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Video not found in favourites."
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error!"
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * /api/video/add:
 *   post:
 *     summary: Thêm mới video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the video
 *                 example: "My Awesome Video"
 *               description:
 *                 type: string
 *                 description: Description of the video
 *                 example: "This is a description of my awesome video."
 *               videoUrl:
 *                 type: string
 *                 description: URL of the video
 *                 example: "http://example.com/video.mp4"
 *               isPublic:
 *                 type: boolean
 *                 description: Indicates whether the video is public
 *                 example: true
 *               category:
 *                 type: string
 *                 description: ID of the category of the video
 *                 example: "60c72b2f9b1e8a2b1d2d3f4e"
 *               playlist:
 *                 type: string
 *                 description: ID of the playlist to which the video belongs
 *                 example: "60c72b2f9b1e8a2b1d2d3f4e"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs of tags associated with the video
 *                 example: ["60c72b2f9b1e8a2b1d2d3f4e", "60c72b2f9b1e8a2b1d2d3f4f"]
 *               videoThumbnail:
 *                 type: string
 *                 description: URL of the video thumbnail
 *                 example: "http://example.com/thumbnail.jpg"
 *               publishedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Publication date of the video
 *                 example: "2024-08-29T12:00:00Z"
 *     responses:
 *       201:
 *         description: Video successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Video uploaded successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the video
 *                       example: "60c72b2f9b1e8a2b1d2d3f4e"
 *                     title:
 *                       type: string
 *                       description: Title of the video
 *                       example: "My Awesome Video"
 *                     description:
 *                       type: string
 *                       description: Description of the video
 *                       example: "This is a description of my awesome video."
 *                     videoUrl:
 *                       type: string
 *                       description: URL of the video
 *                       example: "http://example.com/video.mp4"
 *                     isPublic:
 *                       type: boolean
 *                       description: Indicates whether the video is public
 *                       example: true
 *                     category:
 *                       type: string
 *                       description: ID of the category of the video
 *                       example: "60c72b2f9b1e8a2b1d2d3f4e"
 *                     playlist:
 *                       type: string
 *                       description: ID of the playlist to which the video belongs
 *                       example: "60c72b2f9b1e8a2b1d2d3f4e"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: IDs of tags associated with the video
 *                       example: ["60c72b2f9b1e8a2b1d2d3f4e", "60c72b2f9b1e8a2b1d2d3f4f"]
 *                     videoThumbnail:
 *                       type: string
 *                       description: URL of the video thumbnail
 *                       example: "http://example.com/thumbnail.jpg"
 *                     publishedDate:
 *                       type: string
 *                       format: date-time
 *                       description: Publication date of the video
 *                       example: "2024-08-29T12:00:00Z"
 *       400:
 *         description: Bad request, required fields are missing or permission issue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "All required fields must be provided!"  # or "You do not have permission to upload videos!" or "Invalid video URL!" or "Category does not exist!" or "Playlist does not exist!" or "Tag with ID {tag} does not exist!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error, please try again later."
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the video
 *         title:
 *           type: string
 *           description: The title of the video
 *         description:
 *           type: string
 *           description: The description of the video
 *         videoUrl:
 *           type: string
 *           description: The URL of the video
 *         isPublic:
 *           type: boolean
 *           description: Whether the video is public
 *         writer:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The unique identifier for the writer (user)
 *             name:
 *               type: string
 *               description: The name of the writer
 *             email:
 *               type: string
 *               description: The email of the writer
 *         videoThumnail:
 *           type: string
 *           description: The URL of the video's thumbnail
 *         totalView:
 *           type: integer
 *           description: The total number of views
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the video
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Internal Server Error
 */
