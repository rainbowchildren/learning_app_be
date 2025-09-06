import { Router } from "express";
import { getUser } from "../controllers/userController.js";

const userService = Router();

userService.get("/getDetails", getUser);

export default userService;
