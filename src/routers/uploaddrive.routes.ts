import express from "express";
import multer from "multer";
import { uploadFiles } from "../controllers/uploaddrive.controller";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/file", upload.array("files"), uploadFiles);

/**
 * @swagger
 * tags:
 *   name: Upload
 */

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: Upload multiple files to Google Drive
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to upload.
 *     responses:
 *       200:
 *         description: Successfully uploaded files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileId:
 *                         type: string
 *                         example: "1A2B3C4D5E"
 *                       fileName:
 *                         type: string
 *                         example: "example.jpg"
 *                       webViewLink:
 *                         type: string
 *                         example: "https://drive.google.com/file/d/1A2B3C4D5E/view"
 *                       webContentLink:
 *                         type: string
 *                         example: "https://drive.google.com/uc?id=1A2B3C4D5E"
 *       400:
 *         description: No files uploaded.
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
 *                   example: "No files uploaded."
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
 *                   example: "File upload failed."
 *                 error:
 *                   type: string
 *                   example: "An error occurred while uploading the files."
 */

export default router;
