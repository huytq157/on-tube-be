"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TagSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.TagModel = mongoose_1.default.model("Tag", TagSchema);
