import express from "express";
const router = express.Router();

import {
  subscriptionChannel,
  getSubscribedChannels,
  unsubscribeChannel,
  checkSubscription,
  getSubscribedChannelVideos,
} from "../controllers/subcription.controller";
import { verifyToken } from "../middleware/verifyToken";

router.post("/sub", verifyToken, subscriptionChannel);
router.post("/un-sub", verifyToken, unsubscribeChannel);
router.get("/subcriber", verifyToken, getSubscribedChannels);
router.get("/check-sub/:channelId", verifyToken, checkSubscription);
router.get("/video-sub", verifyToken, getSubscribedChannelVideos);

export default router;
