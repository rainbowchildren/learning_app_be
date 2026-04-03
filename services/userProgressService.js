import { Router } from "express";
import {
  getLevelQuestionProgress,
  getProgressByUserId,
  saveJourney,
  storeProgress,
  reportByUserId,
  // validateAnswer,
} from "../controllers/userProgressController.js";
import { ROLES } from "../constants/constants.js";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";

const userProgress = Router();

userProgress.post(
  "/saveJourney",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.STUDENT),
  saveJourney,
);
userProgress.post(
  "/save",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.STUDENT),
  storeProgress,
);

userProgress.get(
  "/getProgressByUserId",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.STUDENT),
  getProgressByUserId,
);

userProgress.get(
  "/studentReportByLevel/:level/:studentId",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.ADMIN),
  getLevelQuestionProgress,
);

userProgress.get(
  "/report/byUserId",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.OWNER),
  reportByUserId,
);
export default userProgress;
