import { Router } from "express";
import { validateAnswer } from "../controllers/userProgressController.js";
import { ROLES } from "../constants/constants.js";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";

const userProgress = Router();

userProgress.patch(
  "/validate/:questionId",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.STUDENT),
  validateAnswer
);

export default userProgress;
