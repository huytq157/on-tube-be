import express from "express";
import {
  likeVideo,
  dislikeVideo,
  checkIsLiked,
  getLikedVideos,
  checkIsDisliked,
} from "../controllers/like.controller";
import { verifyToken } from "../middleware/verifyToken";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "../middleware/authToken";
const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/like", authenticateToken, likeVideo);
router.get("/video-like", authenticateToken, getLikedVideos);
router.post("/dislike", authenticateToken, dislikeVideo);
router.get("/check-like/:id", authenticateToken, checkIsLiked);
router.get("/check-dislike/:id", authenticateToken, checkIsDisliked);

router.use(limiter);
export default router;
