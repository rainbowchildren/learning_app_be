import { Router } from "express";
import {
  addQuestion,
  fetchQuestions,
} from "../controllers/questionsController.js";

const questionService = Router();

questionService.post("/new", addQuestion);
// questionService.get("/fetch", fetchQuestions); //params
questionService.get("/fetch", fetchQuestions); //query

export default questionService;
