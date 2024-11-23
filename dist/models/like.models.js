"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LikeSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    video: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Video",
        // required: true,
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    type: {
        type: String,
        enum: ["like", "dislike"],
        required: true,
    },
}, {
    timestamps: true,
});
LikeSchema.index({ user: 1, video: 1 }, { unique: true });
// Đảm bảo rằng user chỉ có thể like hoặc dislike một comment cụ thể
LikeSchema.index({ user: 1, comment: 1 }, { unique: true });
exports.LikeModel = mongoose_1.default.model("Like", LikeSchema);
