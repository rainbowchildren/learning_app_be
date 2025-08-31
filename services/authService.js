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
  resetPassword,
  changePassword,
} from "../controllers/authController.js";

const authService = express.Router();

authService.post("/createUser", createNewUser);

authService.get("/usernameCheck", usernameCheck);
authService.post("/login", login);
authService.get("/emailCheck", emailIdExist);
authService.post("/resetPassword", resetPassword);
authService.post("/changePassword", changePassword);

// module.exports = authService;

export default authService;
