// controllers/questionController.js

import mongoose from "mongoose";
import questionModel from "../models/questionModel.js";
import questionSchema from "../models/questionModel.js";
import userProgress from "../models/userProgressModel.js";

// POST /api/questions/upload
export const uploadQuestions = async (req, res) => {
  try {
    const questionsData = req.body; // Expecting an array of question/exercise objects

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return res.status(400).json({ message: "Provide an array of questions" });
    }

    // Optional: check for duplicate globalIndex
    const existingIndexes = await questionSchema.find(
      {
        "order.globalIndex": {
          $in: questionsData.map((q) => q.order.globalIndex),
        },
      },
      { "order.globalIndex": 1 }
    );
    if (existingIndexes.length > 0) {
      return res
        .status(400)
        .json({ message: "Some globalIndex values already exist in DB" });
    }

    // Insert into MongoDB
    const insertedQuestions = await questionSchema.insertMany(questionsData);

    res.status(201).json({
      message: `${insertedQuestions.length} questions/exercises uploaded successfully`,
      data: insertedQuestions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const contentData = req.body; // Expecting an array of question/exercise objects

    if (!Array.isArray(contentData) || contentData.length === 0) {
      return res.status(400).json({ message: "Provide an array of questions" });
    }

    const insertedQuestions = await questionSchema.insertMany(contentData);

    res.status(201).json({
      message: `${contentData.length} questions/exercises uploaded successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const nextQuestion = async (req, res) => {
  try {
    const userId = req.userId || "68dd302567ee1feda1160ca2";

    // aggregate to get latest question by globalIndex
    const [latestQuestion] = await userProgress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      { $sort: { "question.order.globalIndex": -1 } },
      { $limit: 1 },
    ]);
    console.log("latestQuestion", latestQuestion);
    if (!latestQuestion) {
      const content = await questionSchema.findOne({ "order.globalIndex": 1 });
      await userProgress.create({
        userId,
        question: content._id,
        status: { completed: false, inProgress: true, result: false },
      });
      return res.status(200).send({ content });
    }

    if (latestQuestion.status.inProgress) {
      return res.status(200).send({ content: latestQuestion.question });
    }

    // find the next question
    const content = await questionModel.findOne({
      "order.globalIndex": latestQuestion.question.order.globalIndex + 1,
    });

    if (!content) {
      return res.status(200).send({ content: "No more questions" });
    }

    await userProgress.create({
      userId,
      question: content._id,
      status: { completed: false, inProgress: true, result: false },
    });

    res.status(200).send({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
