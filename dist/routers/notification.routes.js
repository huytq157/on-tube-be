"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const authToken_1 = require("../middleware/authToken");
const router = express_1.default.Router();
router.post("/create", authToken_1.authenticateToken, notification_controller_1.createNotification);
router.get("/gets", authToken_1.authenticateToken, notification_controller_1.getNotification);
router.put("/update-seen", authToken_1.authenticateToken, notification_controller_1.updateStatusSeen);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing channels
 */
