"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const like_controller_1 = require("../controllers/like.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
router.post("/like", verifyToken_1.verifyToken, like_controller_1.likeVideo);
router.get("/video-like", verifyToken_1.verifyToken, like_controller_1.getLikedVideos);
router.post("/dislike", verifyToken_1.verifyToken, like_controller_1.dislikeVideo);
router.get("/check-like/:id", verifyToken_1.verifyToken, like_controller_1.checkIsLiked);
router.get("/check-dislike/:id", verifyToken_1.verifyToken, like_controller_1.checkIsDisliked);
router.get("/check-like-comment/:id", verifyToken_1.verifyToken, like_controller_1.checkIsLikedComment);
router.post("/like-comment", verifyToken_1.verifyToken, like_controller_1.likeComment);
router.post("/dislike-comment", verifyToken_1.verifyToken, like_controller_1.dislikeComment);
router.use(limiter);
exports.default = router;
