import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

export function initSocket(server: HttpServer) {
  const io = new IOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Xác thực JWT khi connect socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    if (!onlineUsers.some((u) => u.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    io.emit("return-users", onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
      io.emit("return-users", onlineUsers);
    });

    // Lắng nghe sự kiện tạo notification mới từ phía backend hoặc client
    socket.on("create-new-notification", (data) => {
      const { notification } = data;
      const receivers = notification.user || [];
      receivers.forEach((uid: string) => {
        const client = onlineUsers.find((u) => u.userId === uid);
        if (client) {
          io.to(client.socketId).emit("new-notification", notification);
        }
      });
    });
  });

  // Export thêm io instance nếu muốn dùng ở nơi khác
  return io;
}
