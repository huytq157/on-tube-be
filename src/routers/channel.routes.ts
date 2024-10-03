import express from "express";
import {
  getChannelInfo,
  getChannelVideo,
  searchChannel,
  getChannelPlaylist,
  updateChannel,
} from "../controllers/channel.controller";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.get("/search", searchChannel);
router.get("/:id", getChannelInfo);
router.get("/video/:id", getChannelVideo);
router.get("/playlist/:id", getChannelPlaylist);
router.put("/:id", verifyToken, updateChannel);

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: API for managing channels
 */

/**
 * @swagger
 * /api/channel/search:
 *   get:
 *     summary: Search channels by name
 *     description: Search for channels based on the provided search term
 *     tags: [Channels]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term for channel names
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Successfully found matching channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       avatar:
 *                         type: string
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/channel/{id}:
 *   get:
 *     summary: Get channel information
 *     description: Retrieve information about a specific channel by ID
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The channel ID
 *     responses:
 *       200:
 *         description: Successfully retrieved channel information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Channel not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/channel/video/{id}:
 *   get:
 *     summary: Get videos by channel ID
 *     description: Retrieve a paginated list of videos from a specific channel
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The channel ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Number of videos per page
 *     responses:
 *       200:
 *         description: Successfully retrieved videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 videos:
 *                   type: array
 *                 totalPage:
 *                   type: integer
 *       400:
 *         description: Channel not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/channel/playlist/{id}:
 *   get:
 *     summary: Danh sách phát của channel
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Successfully retrieved playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 playlists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       writer:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       videos:
 *                         type: array
 *                         items:
 *                           type: string
 *                       isPublic:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       400:
 *         description: Invalid channel ID or parameters
 *       500:
 *         description: Server error
 */

export default router;
