import express from "express";
import { ROLES } from "../constants/constants.js";
import { transcribeAudio } from "../controllers/openAIController.js";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/fileMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";

const audioService = express.Router();

audioService.post(
  "/getResult",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.STUDENT),
  upload.single("file"),
  transcribeAudio,
);

export default audioService;
