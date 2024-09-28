import express from "express";
const router = express.Router();

import {
  addPlayList,
  deletePlayList,
  getAllPlayList,
  getPlaylistDetails,
  removeVideoFromPlaylist,
  saveVideoToPlaylist,
  updatePlaylist,
} from "../controllers/playList.controller";
import { verifyToken } from "../middleware/verifyToken";

router.post("/", verifyToken, addPlayList);
router.get("/list", verifyToken, getAllPlayList);
router.get("/:id", verifyToken, getPlaylistDetails);
router.post("/save-to-playlist", verifyToken, saveVideoToPlaylist);
router.delete("/remove-to-playlist", verifyToken, removeVideoFromPlaylist);
router.patch("/:id", verifyToken, updatePlaylist);
router.delete("/:id", verifyToken, deletePlayList);

export default router;

/**
 * @swagger
 * /api/playlist/:
 *   post:
 *     tags: [Playlists]
 *     summary: Tạo danh sách phát
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the playlist.
 *                 example: "My Favorite Videos"
 *               description:
 *                 type: string
 *                 description: A brief description of the playlist.
 *                 example: "A collection of my all-time favorite videos."
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of video IDs to include in the playlist.
 *                 example: ["60c72b2f5f1b2c001f3b2e4e", "60c72b3f5f1b2c001f3b2e4f"]
 *               isPublic:
 *                 type: boolean
 *                 description: Whether the playlist is public or private.
 *                 example: true
 *             required:
 *               - title
 *               - description
 *               - videos
 *     responses:
 *       201:
 *         description: Playlist created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist created successfully"
 *                 playlist:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the playlist.
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     writer:
 *                       type: string
 *                       description: The user ID of the playlist creator.
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isPublic:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request if the required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
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
 * /api/playlist/{id}:
 *   patch:
 *     tags: [Playlists]
 *     summary: Cập nhật danh sách phát
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the playlist.
 *                 example: "Updated Playlist Title"
 *               description:
 *                 type: string
 *                 description: A brief description of the playlist.
 *                 example: "Updated description of the playlist."
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of video IDs to include in the playlist.
 *                 example: ["60c72b2f5f1b2c001f3b2e4e", "60c72b3f5f1b2c001f3b2e4f"]
 *               isPublic:
 *                 type: boolean
 *                 description: Whether the playlist is public or private.
 *                 example: true
 *     responses:
 *       200:
 *         description: Playlist updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist updated successfully"
 *                 playlist:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the playlist.
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     writer:
 *                       type: string
 *                       description: The user ID of the playlist creator.
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isPublic:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request if the required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist ID is required"
 *       404:
 *         description: Playlist not found or user doesn't have permission to update it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist not found or you don't have permission to update"
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
 * /api/playlist/list:
 *   get:
 *     tags: [Playlists]
 *     summary: Danh dách phát của user
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's playlists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 playlists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the playlist.
 *                         example: "612e5f5bfc13ae5a7c000008"
 *                       title:
 *                         type: string
 *                         description: The title of the playlist.
 *                         example: "My Favorite Videos"
 *                       description:
 *                         type: string
 *                         description: A brief description of the playlist.
 *                         example: "A collection of my all-time favorite videos."
 *                       writer:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The unique identifier for the user who created the playlist.
 *                             example: "612e5f5bfc13ae5a7c000001"
 *                           name:
 *                             type: string
 *                             description: The name of the user.
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             description: The email of the user.
 *                             example: "john.doe@example.com"
 *                       videos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The unique identifier for the video.
 *                               example: "60c72b2f5f1b2c001f3b2e4e"
 *                             title:
 *                               type: string
 *                               description: The title of the video.
 *                               example: "My First Video"
 *                             description:
 *                               type: string
 *                               description: A brief description of the video.
 *                               example: "This is a description of my first video."
 *                       isPublic:
 *                         type: boolean
 *                         description: Whether the playlist is public or private.
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the playlist was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the playlist was last updated.
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
 * /api/playlist/save-to-playlist:
 *   post:
 *     tags: [Playlists]
 *     summary: Lưu video vào danh sách phát
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlistId:
 *                 type: string
 *                 description: The unique identifier of the playlist.
 *                 example: "612e5f5bfc13ae5a7c000008"
 *               videoId:
 *                 type: string
 *                 description: The unique identifier of the video.
 *                 example: "60c72b2f5f1b2c001f3b2e4e"
 *     responses:
 *       200:
 *         description: Successfully added the video to the playlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video added to playlist successfully"
 *                 playlist:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier for the playlist.
 *                       example: "612e5f5bfc13ae5a7c000008"
 *                     title:
 *                       type: string
 *                       description: The title of the playlist.
 *                       example: "My Favorite Videos"
 *                     description:
 *                       type: string
 *                       description: A brief description of the playlist.
 *                       example: "A collection of my all-time favorite videos."
 *                     writer:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique identifier for the user who created the playlist.
 *                           example: "612e5f5bfc13ae5a7c000001"
 *                         name:
 *                           type: string
 *                           description: The name of the user.
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           description: The email of the user.
 *                           example: "john.doe@example.com"
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The unique identifier for the video.
 *                             example: "60c72b2f5f1b2c001f3b2e4e"
 *                           title:
 *                             type: string
 *                             description: The title of the video.
 *                             example: "My First Video"
 *                           description:
 *                             type: string
 *                             description: A brief description of the video.
 *                             example: "This is a description of my first video."
 *                     isPublic:
 *                       type: boolean
 *                       description: Whether the playlist is public or private.
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the playlist was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the playlist was last updated.
 *       400:
 *         description: Bad request if playlistId or videoId is missing, or if the video already exists in the playlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist ID and Video ID are required"
 *       404:
 *         description: Not found if the playlist or video does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist not found or you don't have permission to modify it"
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
 * /api/playlist/remove-to-playlist:
 *   delete:
 *     summary: Xóa video khỏi danh sách
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlistId:
 *                 type: string
 *                 description: ID of the playlist from which the video will be removed.
 *                 example: "64b3d1f8a9e4b84a4d5f1b1a"
 *               videoId:
 *                 type: string
 *                 description: ID of the video to be removed from the playlist.
 *                 example: "64b3d1f8a9e4b84a4d5f1b2b"
 *     responses:
 *       200:
 *         description: Successfully removed video from playlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video removed from playlist successfully"
 *                 playlist:
 *                   type: object
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad request due to missing or invalid IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist ID and Video ID are required"
 *       404:
 *         description: Playlist or video not found or permission issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist not found or you don't have permission to modify it"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the playlist.
 *           example: "64b3d1f8a9e4b84a4d5f1b1a"
 *         name:
 *           type: string
 *           description: The name of the playlist.
 *           example: "My Favorite Videos"
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           description: List of video IDs in the playlist.
 *           example: ["64b3d1f8a9e4b84a4d5f1b2b"]
 *         writer:
 *           type: string
 *           description: The user ID of the creator of the playlist.
 *           example: "64b3d1f8a9e4b84a4d5f1b0a"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the playlist was created.
 *           example: "2024-08-29T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the playlist was last updated.
 *           example: "2024-08-29T12:34:56.789Z"
 */
