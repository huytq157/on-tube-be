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
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/sub", authenticateToken, subscriptionChannel);
router.post("/un-sub", authenticateToken, unsubscribeChannel);
router.get("/subcriber", authenticateToken, getSubscribedChannels);
router.get("/check-sub/:channelId", authenticateToken, checkSubscription);
router.get("/video-sub", authenticateToken, getSubscribedChannelVideos);
router.get("/channel/:channelId/subcount", getChannelSubscribersCount);

router.use(limiter);
export default router;
