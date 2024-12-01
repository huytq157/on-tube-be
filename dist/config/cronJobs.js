"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const watchvideo_models_1 = require("../models/watchvideo.models");
node_cron_1.default.schedule("0 0 * * *", async () => {
    const twoWeeksAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    await watchvideo_models_1.WatchedVideoModel.deleteMany({ watchedAt: { $lt: twoWeeksAgo } });
    console.log("Old watched videos deleted.");
});
