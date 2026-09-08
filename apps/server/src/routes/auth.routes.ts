import express from "express";
import signupController from "../controllers/auth.controller";
import signInController from "../controllers/signInController";


const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signInController);

export default router;


