import authService from "../services/authService.js";
import questionService from "../services/questionService.js";
import userLevelProgress from "../services/userLevelProgress.js";
import userService from "../services/userService.js";

export const ROUTES = [
  {
    path: "/auth",
    service: authService,
  },
  {
    path: "/user",
    service: userService,
  },
  {
    path: "/question",
    service: questionService,
  },
  {
    path: "/levelProgress",
    service: userLevelProgress,
  },
];
