"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    user: { type: [mongoose_1.default.Schema.Types.ObjectId] },
    from_user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    video: { type: mongoose_1.default.Schema.Types.ObjectId },
    comment: { type: mongoose_1.default.Schema.Types.ObjectId },
    read: { type: Boolean, default: false },
    url: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});
exports.NotificationModel = mongoose_1.default.model("Notification", NotificationSchema);
