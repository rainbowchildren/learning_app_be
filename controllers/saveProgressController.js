import mongoose from "mongoose";
// import levelProgress from "../models/levelProgress.js";
import authModel from "../models/authModel.js";
import answersModel from "../models/answersModel.js";
import levelProgressModel from "../models/levelProgressModel.js";

export const saveProgress = async (req, res) => {
  try {
    const { userId, questionId, id, answer } = req.body;

    const answerByQuestion = await answersModel.findOne({ questionRef: id });
    const checkAnswer = true;

    if (!checkAnswer) {
      res.status(200).send({ answerCheck: false });
    } else {
      const updateQuestionStatus = await levelProgressModel.findOne({ userId });
    }
  } catch (e) {
    console.log(e);
  }
};
