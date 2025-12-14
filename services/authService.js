import express from "express";
// const {
//   createNewUser,
//   usernameCheck,
//   login,
//   emailIdExist,
//   resetPassword,
//   changePassword,
// } = require("../controllers/authController");
import {
  createNewUser,
  usernameCheck,
  login,
  emailIdExist,
  // resetPassword,
  changePassword,
  requestPasswordReset,
  resetPassword,
  createAdmin,
  createOwner,
} from "../controllers/authController.js";
import { ROLES } from "../constants/constants.js";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";
import { createBulkUsers } from "../controllers/bulkUploadController.js";
import { upload } from "../middlewares/fileMiddleware.js";

const authService = express.Router();

authService.post("/createUser", createNewUser);
authService.post(
  "/createAdmin",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  createAdmin
);
authService.post(
  "/createOwner",
  // verifyJWTMiddleware,
  // authorizeRoles(ROLES.OWNER),
  createOwner
);
authService.get("/usernameCheck", usernameCheck);
authService.post("/login", login);
authService.get("/emailCheck", emailIdExist);
authService.post("/requestPasswordReset", requestPasswordReset);
authService.post("/forgotPassword", resetPassword);
authService.post("/changePassword", changePassword);
authService.post(
  "/uploadUsers",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.OWNER),
  upload.single("file"),
  createBulkUsers
);

// module.exports = authService;

export default authService;
