const express = require("express");
const { createNewUser, getUsers } = require("../controllers/authController");

const authService = express.Router();

authService.post("/new-user", createNewUser);

authService.get("/userslist", getUsers);

module.exports = authService;
