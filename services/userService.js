import { Router } from "express";
import {
  deleteProfile,
  getUser,
  updateProfile,
} from "../controllers/userController.js";

const userService = Router();

userService.get("/getProfile", getUser);
userService.patch("/updateProfile", updateProfile);
userService.delete("/deleteProfile", deleteProfile);

export default userService;
