import { Router } from "express";
// import {
//   addQuestion,
//   nextQuestion,
// } from "../controllers/questionController.js";
// import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
// import { authorizeRoles } from "../middlewares/RBACMiddleware.js";
// import { ROLES } from "../constants/constants.js";
const questions = Router();

// questions.post(
//   "/bulk",
//   // verifyJWTMiddleware,
//   // authorizeRoles(ROLES.ADMIN, ROLES.OWNER),
//   addQuestion
// );
// questions.get(
//   "/next",
//   verifyJWTMiddleware,
//   // authorizeRoles(ROLES.STUDENT),
//   nextQuestion
// );
export default questions;
