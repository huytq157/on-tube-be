import express from "express";
import {
  createNotification,
  getNotification,
  updateStatusSeen,
} from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/authToken";
const router = express.Router();

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
