import { prisma } from "@e2b-agent/database";
import { Request, Response } from "express";

export async function getProjectController(req: Request, res: Response) {
  try {
    const  userId  = req.user!.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "UserId is required",
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.log("Get project error", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get project",
    });
  }
}
