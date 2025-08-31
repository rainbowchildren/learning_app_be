import { Router } from "express";
import { saveProgress } from "../controllers/saveProgressController.js";

const userLevelProgress = Router();

userLevelProgress.post("/saveProgress", saveProgress);

export default userLevelProgress;
