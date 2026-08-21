import { prisma } from "@e2b-agent/database";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken"





export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, "secret") as unknown as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      }
    })

    if (!user) {
         return res.status(401).json({
           success: false,
           message: "User no longer exists",
         });
       }

     req.user = {
      id: user.id,
      email:user.email
     }

    next();
    
  } catch (error) {
    console.log("Auth middleware error :", error);

    return res.status(401).json({
      success: false,
      message:"Invalid or expire token"
    })
  }

}
