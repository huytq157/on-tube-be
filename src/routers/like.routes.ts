import express from "express";
import {
  likeVideo,
  dislikeVideo,
  checkIsLiked,
} from "../controllers/like.controller";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/like", verifyToken, likeVideo);
router.post("/dislike", verifyToken, dislikeVideo);
router.get("/check-like/:id", verifyToken, checkIsLiked);

export default router;
