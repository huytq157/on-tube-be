"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader && typeof authHeader === "string"
        ? authHeader.split(" ")[1]
        : null;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User is not logged in!",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.PASSJWT);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: "Token is not valid!",
        });
    }
};
exports.verifyToken = verifyToken;
