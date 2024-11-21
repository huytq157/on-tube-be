import express from "express";
const router = express.Router();

import {
  getAllCategories,
  addedCategory,
  getVideobyCategory,
} from "../controllers/category.controller";

router.get("/list", getAllCategories);
router.post("/add", addedCategory);
router.get("/videos/:categoryId", getVideobyCategory);

export default router;

/**
 * @swagger
 * /api/categories/list:
 *   get:
 *     summary: Tất cả danh mục
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       title:
 *                         type: string
 *                         example: "Technology"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-09-17T07:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-09-17T07:00:00.000Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/categories/add:
 *   post:
 *     summary: Thêm danh mục
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Technology"
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "Technology"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-17T07:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-17T07:00:00.000Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Title is required
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/categories/videos/{categoryId}:
 *   get:
 *     summary: Lấy video theo danh mục
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of videos belonging to the specified category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       title:
 *                         type: string
 *                         example: "Sample Video"
 *                       description:
 *                         type: string
 *                         example: "This is a sample video description."
 *                       videoUrl:
 *                         type: string
 *                         example: "https://example.com/video.mp4"
 *                       isPublic:
 *                         type: boolean
 *                         example: true
 *                       writer:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c85"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c85"
 *                           title:
 *                             type: string
 *                             example: "Technology"
 *                       totalView:
 *                         type: integer
 *                         example: 100
 *                       publishedDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-09-17T07:00:00.000Z"
 *       400:
 *         description: Bad Request - Category ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Category ID is required"
 *       404:
 *         description: Not Found - No videos found for this category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No videos found for this category"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Server error, please try again later"
 */
