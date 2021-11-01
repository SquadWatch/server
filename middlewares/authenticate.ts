import { NextFunction, Request, Response } from "express";
import { getUserByToken } from "../database/users";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) return res.status(404).json({code: "NO_TOKEN", message: "Token not provided."})
  const user = getUserByToken(token);
  if (!user) return res.status(403).json({code: "INVALID_TOKEN", message: "Token is invalid!"})
  req.user = user;
  next();  
}