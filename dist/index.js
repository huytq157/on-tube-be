"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./config/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./config/cronJobs");
require("./config/auth");
const express_session_1 = __importDefault(require("express-session"));
const auth_routes_1 = __importDefault(require("./routers/auth.routes"));
const upload_routes_1 = __importDefault(require("./routers/upload.routes"));
const video_routes_1 = __importDefault(require("./routers/video.routes"));
const playlist_routes_1 = __importDefault(require("./routers/playlist.routes"));
const category_routes_1 = __importDefault(require("./routers/category.routes"));
const tag_routes_1 = __importDefault(require("./routers/tag.routes"));
const channel_routes_1 = __importDefault(require("./routers/channel.routes"));
const comment_routes_1 = __importDefault(require("./routers/comment.routes"));
const subcription_routes_1 = __importDefault(require("./routers/subcription.routes"));
const notification_routes_1 = __importDefault(require("./routers/notification.routes"));
const like_routes_1 = __importDefault(require("./routers/like.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || "*";
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (allowedOrigins === "*" || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
const databaseUrl = process.env.DATABASE_URL;
(0, database_1.default)(databaseUrl);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, swagger_1.setupSwagger)(app);
app.use(express_1.default.static("public"));
app.get("/", (req, res) => {
    res.send("Không có đâu!");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/video", video_routes_1.default);
app.use("/api/playlist", playlist_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/tags", tag_routes_1.default);
app.use("/api/channel", channel_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/subcription", subcription_routes_1.default);
app.use("/api/notification", notification_routes_1.default);
app.use("/api/vote", like_routes_1.default);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// CommonJS (require)
// ES Modules (import)
