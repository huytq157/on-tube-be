"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subcription_controller_1 = require("../controllers/subcription.controller");
const verifyToken_1 = require("../middleware/verifyToken");
router.post("/sub", verifyToken_1.verifyToken, subcription_controller_1.subscriptionChannel);
router.post("/un-sub", verifyToken_1.verifyToken, subcription_controller_1.unsubscribeChannel);
router.get("/subcriber", verifyToken_1.verifyToken, subcription_controller_1.getSubscribedChannels);
router.get("/check-sub/:channelId", verifyToken_1.verifyToken, subcription_controller_1.checkSubscription);
router.get("/video-sub", verifyToken_1.verifyToken, subcription_controller_1.getSubscribedChannelVideos);
exports.default = router;
