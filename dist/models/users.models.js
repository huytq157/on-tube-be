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
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email address is required"],
        validate: {
            validator: function (email) {
                const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email);
            },
            message: "Please fill a valid email address",
        },
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dkbothcn5/image/upload/v1727074201/images.jpg",
    },
    roleId: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    background: {
        type: String,
        default: "https://res.cloudinary.com/dkbothcn5/image/upload/v1727019261/t%E1%BA%A3i_xu%E1%BB%91ng_i2b6sd.jpg",
    },
    description: {
        type: String,
        default: "This is the user description.",
    },
    watchedVideos: [
        {
            video: { type: mongoose_1.Schema.Types.ObjectId, ref: "Video" },
            watchTime: { type: Number },
            watchedAt: { type: Date, default: Date.now },
        },
    ],
    googleId: { type: String, unique: true },
}, {
    timestamps: true,
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
