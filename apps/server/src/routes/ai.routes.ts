import { Router } from "express";
import { aiController } from "../controllers/aiController";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/",authMiddleware, aiController);

export default router;