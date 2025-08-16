const express = require("express");
const {
  createNewUser,
  usernameCheck,
  login,
  emailIdExist,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const authService = express.Router();

authService.post("/createUser", createNewUser);

authService.get("/usernameCheck", usernameCheck);
authService.post("/login", login);
authService.get("/emailCheck", emailIdExist);
authService.post("/resetPassword", resetPassword);
authService.post("/changePassword", changePassword);

module.exports = authService;
