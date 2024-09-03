import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/users.models";

const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.roleId !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export default requireAdmin;
