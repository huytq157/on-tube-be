import express, { Request, Response } from "express";
import { UserModel } from "../models/users.models";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.PASSJWT;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}
if (!JWT_REFRESH_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

interface CustomRequest extends Request {
  userId?: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing parameters!",
      });
    }

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }

    const hashPassword = await argon2.hash(password);

    const newUser = new UserModel({
      email,
      name,
      password: hashPassword,
      roleId: "USER",
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        roleId: newUser.roleId,
      },
      JWT_SECRET,
      { expiresIn: "30s" }
    );

    return res.status(201).json({
      success: true,
      message: "Register success!",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing parameters!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required!",
      });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, decoded: any) => {
      if (err || !decoded) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token.",
        });
      }

      const { userId, roleId } = decoded as jwt.JwtPayload;

      const newAccessToken = jwt.sign({ userId, roleId }, JWT_SECRET, {
        expiresIn: "8h",
      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully!",
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getUser = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required!",
    });
  }

  try {
    const userInfo = await UserModel.findById(userId)
      .select("-password")
      .exec();
    if (userInfo) {
      return res.status(200).json({
        success: true,
        user: userInfo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
