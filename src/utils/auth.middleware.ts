import { Request, NextFunction, Response } from "express";
import { verifyToken } from "./token";
import { User } from "../domain/entities/User.entity";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("⛔ You are not allowed to perform this action.");
    }

    // Decoding token
    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.userEmail }).select("+password");
    if (!user) {
      throw new Error("⛔ You are not allowed to perform this action.");
    }

    req.user = {
      id: user.id,
      role: user.role as unknown as CUSTOM_ROLE,
    }

    next();

    return null;
  } catch (error) {
    res.status(401).json({ error: "⛔ You are not allowed to perform this action." });
    return null;
  }
};

module.exports = { isAuth };
