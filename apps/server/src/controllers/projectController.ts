import { prisma } from "@e2b-agent/database";
import { Sandbox } from "e2b";
import { Request, Response } from "express";

export async function projectController(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const userId = req.user!.id;

    if (!name || !userId) {
      return res.status(400).json({
        success: false,
        message: "name and userid is required",
      });
    }

    const sandbox = await Sandbox.create();

    const project = await prisma.project.create({
      data: {
        name,
        userId,
        sandboxId: sandbox.sandboxId,
      },
    });

    return res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: String(error),
    });
  }
}
