import { Router } from "express";
import {
  deleteProfile,
  getAllAdmins,
  getMyStudents,
  getUser,
  updateProfile,
} from "../controllers/userController.js";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";
import { ROLES } from "../constants/constants.js";

const userService = Router();

userService.get("/byId", verifyJWTMiddleware, getUser);
userService.patch("/updateProfile", verifyJWTMiddleware, updateProfile);
userService.delete("/deleteProfile", deleteProfile);
userService.get(
  "/getAllAdmins",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  getAllAdmins
);

userService.get("/getMyStudents", verifyJWTMiddleware, getMyStudents);

export default userService;
