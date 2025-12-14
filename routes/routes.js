import authService from "../services/authService.js";
import cloudService from "../services/cloudService.js";
import orgService from "../services/organisationService.js";
import questions from "../services/questionService.js";
import userProgress from "../services/userProgressService.js";

import userService from "../services/userService.js";

export const ROUTES = [
  {
    path: "/api/auth",
    service: authService,
  },
  {
    path: "/api/user",
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
  {
    path: "/api/Organisation",
    service: userProgress,
  },
  {
    path: "/api/file",
    service: cloudService,
  },
  { path: "/api/organisation", service: orgService },
];
