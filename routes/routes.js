import authService from "../services/authService.js";
import questions from "../services/questionService.js";
import userProgress from "../services/userProgressService.js";

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
    path: "/api/content",
    service: questions,
  },
  {
    path: "/api/journey",
    service: userProgress,
  },
];
