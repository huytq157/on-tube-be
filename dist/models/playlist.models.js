"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PlaylistSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    writer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    videos: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    isPublic: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.PlaylistModel = mongoose_1.default.model("Playlist", PlaylistSchema);
