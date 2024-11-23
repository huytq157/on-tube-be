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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.login = exports.register = void 0;
const users_models_1 = require("../models/users.models");
const argon2 = __importStar(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.PASSJWT;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing parameters!",
            });
        }
        const userExist = await users_models_1.UserModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }
        const hashPassword = await argon2.hash(password);
        const newUser = new users_models_1.UserModel({
            email,
            name,
            password: hashPassword,
            roleId: "USER",
        });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({
            userId: newUser._id,
            roleId: newUser.roleId,
        }, JWT_SECRET, { expiresIn: "12h" });
        return res.status(201).json({
            success: true,
            message: "Register success!",
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                success: false,
                message: "Missing paramaters!",
            });
        const findUser = await users_models_1.UserModel.findOne({ email });
        if (!findUser)
            return res.status(400).json({
                success: false,
                message: "User not exits!",
            });
        const checkPass = await argon2.verify(findUser.password, password);
        if (!checkPass)
            return res.status(400).json({
                success: false,
                message: "Password was wrong!",
            });
        const token = jsonwebtoken_1.default.sign({
            userId: findUser._id,
            roleId: findUser.roleId,
        }, JWT_SECRET, { expiresIn: "12h" });
        return res.status(200).json({
            success: true,
            message: "Login success!",
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server not found!",
        });
    }
};
exports.login = login;
const getUser = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required!",
        });
    }
    try {
        const userInfo = await users_models_1.UserModel.findById(userId)
            .select("-password")
            .exec();
        if (userInfo) {
            return res.status(200).json({
                success: true,
                user: userInfo,
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};
exports.getUser = getUser;
