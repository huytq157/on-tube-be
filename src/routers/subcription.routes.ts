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

router.post("/sub", verifyToken, subscriptionChannel);
router.post("/un-sub", verifyToken, unsubscribeChannel);
router.get("/subcriber", verifyToken, getSubscribedChannels);
router.get("/check-sub/:channelId", verifyToken, checkSubscription);
router.get("/video-sub", verifyToken, getSubscribedChannelVideos);
router.get("/channel/:channelId/subcount", getChannelSubscribersCount);

export default router;
