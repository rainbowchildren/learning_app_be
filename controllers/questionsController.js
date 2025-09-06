import questionsModel from "../models/questionsModel.js";
import levelProgressModel from "../models/levelProgressModel.js";

export const addQuestion = async (req, res) => {
  try {
    const { questions } = req.body;
    console.log("QUESTIONS", questions);
    const result = await questionsModel.insertMany(
      questions.map((q) => ({ questionId: q }))
    );
    console.log("result", result);
    res
      .status(200)
      .send({ message: "questions insertion successfull", success: true });
  } catch (e) {
    console.log(e);
  }
};

// fetchQuestions controller
export const fetchQuestions = async (req, res) => {
  try {
    const { type, userId } = req.query;

    if ((type !== "start" && type !== "progress") || !userId) {
      return res
        .status(400)
        .send({ message: "Invalid query or userId is missing" });
    }

    const userProgress = await levelProgressModel.findOne({ userId });
    console.log("userProgress", userProgress);
    if (type === "start") {
      if (!userProgress) {
        const newQ = await questionsModel.aggregate([{ $limit: 3 }]);
        console.log("newQ", newQ);
        return res.status(200).send({ questions: newQ });
      } else {
        const { userJourney } = userProgress;

        // const lastQuestionCompletedId =
        //   userJourney[userJourney.length - 1].questionId;

        const nextQuestions = await questionsModel
          .find({ questionId: { $gt: "2_1" } }) // greater than last completed
          // .sort({ questionId: 1 })                                 // ascending order
          .limit(3);

        res.status(200).send({ nextQuestions });
      }
    } else {
      const nextQuestions = await questionsModel
        .find({ questionId: { $gt: "2_1" } }) // greater than last completed
        // .sort({ questionId: 1 })                                 // ascending order
        .limit(1);
    }
  } catch (e) {
    console.error("Error in fetchQuestions:", e);
    res.status(500).send({ message: "Server error", error: e.message });
  }
};

//fetch questions flow
// check if userId is there in levelProgress
// if type = start then give 3 questions
// if type = progress then give one question from the last question
