const express = require("express");
const { createNewUser } = require("../controllers/authController");

const authService = express.Router();

authService.post("/new-user", createNewUser);

authService.get("/userslist");

module.exports = authService;
