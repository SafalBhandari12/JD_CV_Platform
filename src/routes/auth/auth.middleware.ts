import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./auth.helper";
import { returnAccessToken } from "./auth.types";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header is missing" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token is missing" });
    return;
  }

  try {
    // Verify the token
    const user = verifyAccessToken(token);
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    (req as any).user = user as returnAccessToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user as returnAccessToken;

  if( !user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (user.role !== "USER") {
    res.status(403).json({ message: "Forbidden: Only users can access this resource" });
    return;
  }
};

export const isOrg = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user as returnAccessToken;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (user.role !== "ORG") {
    res
      .status(403)
      .json({
        message: "Forbidden: Only organizations can access this resource",
      });
    return;
  }

  next();
};
