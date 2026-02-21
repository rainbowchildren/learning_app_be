import express from "express";
import { byLevel } from "../controllers/feedbackController.js";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";
import { ROLES } from "../constants/constants.js";
const feedbackService = express.Router();

// GET /feedbackByLevel/:levelId
feedbackService.get(
  "/byLevel/:levelId",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.STUDENT),
  byLevel,
);

export default feedbackService;
