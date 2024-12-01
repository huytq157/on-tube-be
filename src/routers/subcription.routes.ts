import express from "express";
const router = express.Router();

import {
  subscriptionChannel,
  getSubscribedChannels,
  unsubscribeChannel,
  checkSubscription,
  getSubscribedChannelVideos,
  getChannelSubscribersCount,
} from "../controllers/subcription.controller";
import { verifyToken } from "../middleware/verifyToken";
import { authenticateToken } from "../middleware/authToken";

router.post("/sub", authenticateToken, subscriptionChannel);
router.post("/un-sub", authenticateToken, unsubscribeChannel);
router.get("/subcriber", authenticateToken, getSubscribedChannels);
router.get("/check-sub/:channelId", authenticateToken, checkSubscription);
router.get("/video-sub", authenticateToken, getSubscribedChannelVideos);
router.get("/channel/:channelId/subcount", getChannelSubscribersCount);

export default router;
