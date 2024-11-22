import express from "express";
import {
  likeVideo,
  dislikeVideo,
  checkIsLiked,
  likeComment,
  dislikeComment,
  checkIsLikedComment,
  getLikedVideos,
  checkIsDisliked,
} from "../controllers/like.controller";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/like", verifyToken, likeVideo);
router.get("/video-like", verifyToken, getLikedVideos);
router.post("/dislike", verifyToken, dislikeVideo);
router.get("/check-like/:id", verifyToken, checkIsLiked);
router.get("/check-dislike/:id", verifyToken, checkIsDisliked);
router.get("/check-like-comment/:id", verifyToken, checkIsLikedComment);
router.post("/like-comment", verifyToken, likeComment);
router.post("/dislike-comment", verifyToken, dislikeComment);

export default router;
