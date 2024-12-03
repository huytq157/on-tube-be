import express from "express";
import {
  likeVideo,
  dislikeVideo,
  checkIsLiked,
  getLikedVideos,
  checkIsDisliked,
  likeComment,
  disLikeComment,
  checkIsLikedComment,
} from "../controllers/like.controller";
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
router.post("/like-comment", authenticateToken, likeComment);
router.post("/dislike-comment", authenticateToken, disLikeComment);
router.post("/check-like-comment", authenticateToken, checkIsLikedComment);

router.use(limiter);
export default router;
