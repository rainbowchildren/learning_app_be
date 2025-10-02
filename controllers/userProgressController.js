import questionModel from "../models/questionModel.js";
import userProgressModel from "../models/userProgressModel.js";

export const validateAnswer = async (req, res) => {
  try {
    const userId = req.userId || "68dd302567ee1feda1160ca2";
    const { questionId } = req.params;
    const { answer } = req.body;

    if (!answer || !questionId) {
      return res
        .status(400)
        .send({ message: `${!answer ? "answer" : "questionId"} is missing` });
    }

    const questionRecord = await userProgressModel.findOne({
      userId,
      question: questionId,
    });
    console.log("questionRecord", questionRecord);
    if (!questionRecord) {
      return res.status(400).send({ message: "Invalid questionID for user" });
    }

    if (questionRecord.status.completed) {
      return res
        .status(400)
        .send({ message: "User alredy completed the question" });
    }
    // Fetch the correct answer from questionModel
    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(400).send({ message: "Question not found" });
    }

    // Update status based on correctness
    if (answer === "B") {
      questionRecord.status.completed = true;
      questionRecord.status.inProgress = false;
    } else {
      questionRecord.status.completed = false;
      questionRecord.status.inProgress = true;
    }

    await questionRecord.save();

    res.status(200).send({
      message: "Answer validated",
      success: answer === "B",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};
