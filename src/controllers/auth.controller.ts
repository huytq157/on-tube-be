import express, { Request, Response } from "express";
import { UserModel } from "../models/users.models";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.PASSJWT;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
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
      { expiresIn: "12h" }
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Missing paramaters!",
      });

    const findUser = await UserModel.findOne({ email });

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

    const token = jwt.sign(
      {
        userId: findUser._id,
        roleId: findUser.roleId,
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login success!",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

interface CustomRequest extends Request {
  userId?: string;
}

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
