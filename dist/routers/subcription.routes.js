"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subcription_controller_1 = require("../controllers/subcription.controller");
const authToken_1 = require("../middleware/authToken");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
router.post("/sub", authToken_1.authenticateToken, subcription_controller_1.subscriptionChannel);
router.post("/un-sub", authToken_1.authenticateToken, subcription_controller_1.unsubscribeChannel);
router.get("/subcriber", authToken_1.authenticateToken, subcription_controller_1.getSubscribedChannels);
router.get("/check-sub/:channelId", authToken_1.authenticateToken, subcription_controller_1.checkSubscription);
router.get("/video-sub", authToken_1.authenticateToken, subcription_controller_1.getSubscribedChannelVideos);
router.get("/channel/:channelId/subcount", subcription_controller_1.getChannelSubscribersCount);
router.use(limiter);
exports.default = router;
