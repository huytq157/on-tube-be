import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  replyComment,
  getComments,
} from "../controllers/comment.controller";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.delete("/:id", verifyToken, deleteComment);
router.put("/:id", verifyToken, updateComment);
router.post("/reply", verifyToken, replyComment);
router.get("/:video_id", getComments);

export default router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * /api/comments/create:
 *   post:
 *     summary: Create a new comment on a video
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - video_id
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The text of the comment
 *               video_id:
 *                 type: string
 *                 description: The ID of the video being commented on
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing parameter comment text
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The updated text of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found or user unauthorized
 *       400:
 *         description: Missing parameter comment text
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Comment not found or user unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/comments/reply:
 *   post:
 *     summary: Reply to an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - parent_id
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The text of the reply
 *               parent_id:
 *                 type: string
 *                 description: The ID of the comment being replied to
 *     responses:
 *       200:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reply:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing parameter comment text or parent comment ID
 *       404:
 *         description: Parent comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/comments/{video_id}:
 *   get:
 *     summary: Get comments for a specific video
 *     description: Retrieve a list of comments for a given video, with options for pagination and filtering by parent comment ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: video_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the video to fetch comments for.
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: string
 *           default: null
 *         required: false
 *         description: The ID of the parent comment to fetch replies for. Use null to fetch top-level comments.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: The number of comments to return per page.
 *     responses:
 *       200:
 *         description: A list of comments with pagination info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The comment ID.
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       video:
 *                         type: string
 *                         description: The ID of the video the comment belongs to.
 *                       comment:
 *                         type: string
 *                         description: The content of the comment.
 *                       parent_id:
 *                         type: string
 *                         description: The parent comment ID if it's a reply, or null for top-level comments.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of comments for the video.
 *                     page:
 *                       type: integer
 *                       description: Current page number.
 *                     limit:
 *                       type: integer
 *                       description: Number of comments per page.
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages available.
 *       400:
 *         description: Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
