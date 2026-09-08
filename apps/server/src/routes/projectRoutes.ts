import { Router } from "express";
import { projectController } from "../controllers/projectController";
import { getProjectController } from "../controllers/getProjectController";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware ,projectController);
router.get("/", authMiddleware, getProjectController);

export default router;
