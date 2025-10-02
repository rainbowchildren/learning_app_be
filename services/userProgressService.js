import { Router } from "express";
import { validateAnswer } from "../controllers/userProgressController.js";

const userProgress = Router();

userProgress.patch("/validate/:questionId", validateAnswer);

export default userProgress;
