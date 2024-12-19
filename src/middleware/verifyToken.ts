import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token =
    authHeader && typeof authHeader === "string"
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User is not logged in!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.PASSJWT as string) as {
      userId: string;
    };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token is not valid!",
    });
  }
};
