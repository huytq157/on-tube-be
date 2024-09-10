import express from "express";
import connectDatabase from "./config/database";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import cookieParser from "cookie-parser";

import authRoutes from "./routers/auth.routes";
import uploadRoute from "./routers/upload.routes";
import videoRoute from "./routers/video.routes";
import playlistRoute from "./routers/playlist.routes";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const databaseUrl = process.env.DATABASE_URL as string;
connectDatabase(databaseUrl);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

setupSwagger(app);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Không có đâu!");
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/video", videoRoute);
app.use("/api/playlist", playlistRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// CommonJS (require)
// ES Modules (import)
