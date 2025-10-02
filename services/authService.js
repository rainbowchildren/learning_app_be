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
} from "../controllers/authController.js";

const authService = express.Router();

authService.post("/createUser", createNewUser);

authService.get("/usernameCheck", usernameCheck);
authService.post("/login", login);
authService.get("/emailCheck", emailIdExist);
authService.post("/requestPasswordReset", requestPasswordReset);
authService.post("/forgotPassword", resetPassword);
authService.post("/changePassword", changePassword);

// module.exports = authService;

export default authService;
