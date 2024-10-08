import express from "express";
import {
  createNotification,
  getNotification,
  updateStatusSeen,
} from "../controllers/notification.controller";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/create", verifyToken, createNotification);
router.get("/gets", verifyToken, getNotification);
router.put("/update-seen", verifyToken, updateStatusSeen);

export default router;

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing channels
 */
