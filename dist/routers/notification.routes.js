"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/create", verifyToken_1.verifyToken, notification_controller_1.createNotification);
router.get("/gets", verifyToken_1.verifyToken, notification_controller_1.getNotification);
router.put("/update-seen", verifyToken_1.verifyToken, notification_controller_1.updateStatusSeen);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing channels
 */
