import cron from "node-cron";
import { WatchedVideoModel } from "../models/watchvideo.models";

cron.schedule("0 0 * * *", async () => {
  const twoWeeksAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  await WatchedVideoModel.deleteMany({ watchedAt: { $lt: twoWeeksAgo } });
  console.log("Old watched videos deleted.");
});
