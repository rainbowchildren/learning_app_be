import { Router } from "express";
import { verifyJWTMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/RBACMiddleware.js";
import { ROLES } from "../constants/constants.js";
import {
  createOrg,
  deleteOrg,
  getAllOrg,
  getOrgById,
  updateOrgById,
} from "../controllers/organisationController.js";

const orgService = Router();

orgService.post(
  "/create",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  createOrg
);
orgService.get(
  "/all",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  getAllOrg
);
orgService.get(
  "/getById",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  getOrgById
);
orgService.patch(
  "/updateOrgById",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  updateOrgById
);
orgService.delete(
  "/delete",
  verifyJWTMiddleware,
  authorizeRoles(ROLES.OWNER),
  deleteOrg
);

export default orgService;
