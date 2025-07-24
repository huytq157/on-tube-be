"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let onlineUsers = [];
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    // Xác thực JWT khi connect socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication error'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.userId = decoded.id;
            next();
        }
        catch (err) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        if (!onlineUsers.some((u) => u.userId === userId)) {
            onlineUsers.push({ userId, socketId: socket.id });
        }
        io.emit('return-users', onlineUsers);
        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
            io.emit('return-users', onlineUsers);
        });
        socket.on('create-new-notification', (data) => {
            const { notification } = data;
            const receivers = notification.user || [];
            receivers.forEach((uid) => {
                const client = onlineUsers.find((u) => u.userId === uid);
                if (client) {
                    io.to(client.socketId).emit('new-notification', notification);
                }
            });
        });
    });
    return io;
}
